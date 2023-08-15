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
import { FilterTerryCheckinDto } from '../dto/terry-filter.dto';
import _ from 'lodash';
import { IPagination } from 'src/shared/types';
import { getPaginationHeaders } from 'src/shared/pagination.helpers';

@Injectable()
export class TerryCheckinService {
  constructor(
    private readonly terryCheckinRepo: TerryCheckinRepository,
    private readonly terryRepo: TerryRepository,
  ) {}

  async checkin(data: TerryCheckinInputDto, profileId: string) {
    const terry = await this.terryRepo.findByIdOrFail(data.terryId);
    if (!terry.isAvailable || terry.profileId === profileId) {
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
    return this.terryCheckinRepo.create({ profileId, ...data });
  }

  async update(
    data: UpdateTerryCheckinInputDto,
    checkinId: string,
    profileId: string,
  ) {
    return this.terryCheckinRepo.updateOne({ _id: checkinId, profileId }, data);
  }

  async get(checkinId: string, profileId: string) {
    return this.terryCheckinRepo.findOneOrFail({ _id: checkinId, profileId });
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
}
