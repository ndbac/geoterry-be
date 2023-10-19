import { Injectable } from '@nestjs/common';
import { TerryRepository } from '../terry.repository';
import { TerryFilterInputDto } from '../dto/terry-filter.dto';
import { IPagination } from 'src/shared/types';
import { TerrySearchHelper } from './terry-search.helper';
import { getPaginationHeaders } from 'src/shared/pagination.helpers';
import mongoose from 'mongoose';
import { TerryUserMappingRepository } from '../../terry-user-mapping/terry-user-mapping.repository';
import _ from 'lodash';

@Injectable()
export class HunterTerryService {
  constructor(
    private readonly terryRepo: TerryRepository,
    private readonly terrySearchHelper: TerrySearchHelper,
    private readonly terryUserMappingRepo: TerryUserMappingRepository,
  ) {}

  async getTerryById(
    terryId: string,
    profileId: string,
    latitude?: number,
    longitude?: number,
    markAsSaved?: boolean,
    markAsFavourited?: boolean,
  ) {
    if (latitude && longitude) {
      const res = await this.terryRepo.aggregate([
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
            spherical: true,
            query: {
              _id: new mongoose.Types.ObjectId(terryId),
            },
            distanceField: 'distance',
          },
        },
        ...this.terrySearchHelper.normalizedMongoDbRecords(),
      ]);
      if (!res[0]) {
        return this.terryRepo.throwErrorNotFound();
      }
      await this.updateTerryCustomData(terryId, profileId, {
        markAsSaved,
        markAsFavourited,
      });
      return res[0];
    }
    await this.updateTerryCustomData(terryId, profileId, {
      markAsSaved,
      markAsFavourited,
    });
    return this.terryRepo.findOneOrFail({ _id: terryId });
  }

  async filterTerries(data: TerryFilterInputDto, pagination: IPagination) {
    const { queryWithoutPagination, queryWithPagination } =
      this.terrySearchHelper.convertTerryFilterDtoToMongoAggregation(
        data,
        pagination,
      );
    const terries = await this.terryRepo.aggregate([
      ...queryWithPagination,
      ...this.terrySearchHelper.normalizedMongoDbRecords(),
    ]);
    const total =
      (
        await this.terryRepo.aggregate([
          ...queryWithoutPagination,
          {
            $count: 'total',
          },
        ])
      )[0]?.total || 0;
    return {
      items: terries,
      headers: getPaginationHeaders(pagination, total),
    };
  }

  private updateTerryCustomData = async (
    terryId: string,
    profileId: string,
    payload: {
      markAsSaved?: boolean;
      markAsFavourited?: boolean;
    },
  ) => {
    if (!_.isEmpty(payload)) {
      await this.terryUserMappingRepo.updateOneOrCreate(
        {
          terryId,
          profileId,
        },
        {
          terryId,
          profileId,
          favourite: payload.markAsFavourited,
          saved: payload.markAsSaved,
        },
      );
    }
  };
}
