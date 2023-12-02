import { Injectable } from '@nestjs/common';
import { TerryCheckinRepository } from '../terry-checkin.repository';
import {
  TerryCheckinInputDto,
  UpdateTerryCheckinInputDto,
} from '../dto/terry-checkin.dto';
import { TerryRepository } from 'src/modules/terry/terry.repository';
import { throwStandardError } from 'src/errors/helpers';
import { ErrorCode } from 'src/errors/error-defs';
import config from 'config';
import haversine from 'haversine-distance';
import {
  FilterTerryCheckinDto,
  ReadTerryCheckinQueryDto,
} from '../dto/terry-filter.dto';
import _ from 'lodash';
import { IPagination } from 'src/shared/types';
import { getPaginationHeaders } from 'src/shared/pagination.helpers';
import { TerryUserMappingRepository } from 'src/modules/terry-user-mapping/terry-user-mapping.repository';
import { ClientSession } from 'mongoose';
import { ProfileRepository } from 'src/modules/profile/profile.repository';
import { ETerryCheckedInFindAspects } from '../types';
import { TerryCheckinDocument } from '../terry-checkin.model';
import { convertObject } from 'src/shared/mongoose/helpers';

@Injectable()
export class TerryCheckinService {
  constructor(
    private readonly terryCheckinRepo: TerryCheckinRepository,
    private readonly terryRepo: TerryRepository,
    private readonly terryUserMappingRepo: TerryUserMappingRepository,
    private readonly profileRepo: ProfileRepository,
  ) {}

  async checkin(data: TerryCheckinInputDto, profileId: string) {
    return this.terryRepo.withTransaction(async (session) => {
      const terry = await this.terryRepo.findByIdOrFail(data.terryId, {
        session,
      });
      if (!terry.isAvailable) {
        return throwStandardError(ErrorCode.INVALID_TERRY);
      }
      const maxDistance = config.get<number>('terry.maxDistanceToCheckin');
      const distance = haversine(data.location, {
        latitude: terry.location.coordinates[1],
        longitude: terry.location.coordinates[0],
      });
      if (distance > maxDistance) {
        return throwStandardError(ErrorCode.OUT_OF_DISTANCE);
      }
      if (data.rate && data.isFound) {
        await this.updateTerryUserMapping(
          data.rate,
          terry.id,
          profileId,
          session,
        );
      }
      await this.profileRepo.updateById(profileId, {
        $inc: {
          rewardPoints: data.isFound
            ? (terry.metadata?.size || 0) +
              (terry.metadata?.terrain || 0) +
              (terry.metadata?.difficulty || 0)
            : 0,
          totalCheckedinTerry: data.isFound ? 1 : 0,
        },
      });
      return this.terryCheckinRepo.updateOneOrCreate(
        { profileId, terryId: data.terryId },
        { profileId, ...data },
        { session },
      );
    });
  }

  async update(
    data: UpdateTerryCheckinInputDto,
    checkinId: string,
    profileId: string,
  ) {
    return this.terryRepo.withTransaction(async (session) => {
      const checkinRecord = await this.terryCheckinRepo.findByIdOrFail(
        checkinId,
        {
          session,
        },
      );
      if (data.rate) {
        await this.updateTerryUserMapping(
          data.rate,
          checkinRecord.terryId,
          profileId,
          session,
        );
      }
      return this.terryCheckinRepo.updateOne(
        { _id: checkinId, profileId },
        data,
        { session },
      );
    });
  }

  async get(
    checkinId: string,
    profileId: string,
    query: ReadTerryCheckinQueryDto,
  ) {
    let terryCheckin: TerryCheckinDocument | undefined = undefined;
    if (query.findBy === ETerryCheckedInFindAspects.TERRY_ID) {
      terryCheckin = await this.terryCheckinRepo.findOneOrFail({
        terryId: checkinId,
        profileId,
      });
    } else {
      terryCheckin = await this.terryCheckinRepo.findOneOrFail({
        _id: checkinId,
        profileId,
      });
    }
    if (query.includeUserPath) {
      const mapping = await this.terryUserMappingRepo.findOne({
        terryId: terryCheckin.terryId,
        profileId,
      });
      return { ...convertObject(terryCheckin), path: mapping?.path };
    }
    return terryCheckin;
  }

  async delete(checkinId: string, profileId: string) {
    await this.terryCheckinRepo.deleteOne({ _id: checkinId, profileId });
  }

  async filter(
    filters: FilterTerryCheckinDto,
    profileId: string,
    pagination: IPagination,
  ) {
    const commonFilter: any = { profileId };
    if (!_.isEmpty(filters.terryIds)) {
      commonFilter.terryId = { $in: filters.terryIds };
    }
    const data = await this.terryCheckinRepo.find(commonFilter, {
      skip: pagination.offset,
      limit: pagination.pageSize,
      sort: { createdAt: -1 },
    });
    const total = await this.terryCheckinRepo.countWithFindOption(commonFilter);
    return {
      items: data,
      headers: getPaginationHeaders(pagination, total),
    };
  }

  private async updateTerryUserMapping(
    rate: number,
    terryId: string,
    profileId: string,
    session: ClientSession,
  ) {
    await this.terryUserMappingRepo.updateOneOrCreate(
      { profileId, terryId },
      {
        rate,
        checkedIn: true,
      },
      { session },
    );
  }
}
