import { Injectable } from '@nestjs/common';
import { TerryRepository } from '../terry.repository';
import { TerryFilterInputDto } from '../dto/terry-filter.dto';
import { IPagination } from 'src/shared/types';
import { TerrySearchHelper } from './terry-search.helper';
import { getPaginationHeaders } from 'src/shared/pagination.helpers';
import mongoose from 'mongoose';

@Injectable()
export class HunterTerryService {
  constructor(
    private readonly terryRepo: TerryRepository,
    private readonly terrySearchHelper: TerrySearchHelper,
  ) {}

  async getTerryById(terryId: string, latitude?: number, longitude?: number) {
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
      return res[0];
    }
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
}
