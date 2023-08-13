import { Injectable } from '@nestjs/common';
import { TerryRepository } from '../terry.repository';
import { TerryInputDto, TerryUpdateInputDto } from '../dto/terry.dto';
import { TerryFilterInputDto } from '../dto/terry-filter.dto';
import { MongoLocationType } from 'src/shared/mongoose/types';
import { IPagination } from 'src/shared/types';
import { TerrySearchHelper } from './terry-search.helper';
import { getPaginationHeaders } from 'src/shared/pagination.helpers';

@Injectable()
export class TerryService {
  constructor(
    private readonly terryRepo: TerryRepository,
    private readonly terrySearchHelper: TerrySearchHelper,
  ) {}

  async createTerry(data: TerryInputDto, profileId: string) {
    const terry = await this.terryRepo.create({
      profileId,
      ...data,
      location: {
        type: MongoLocationType.POINT,
        coordinates: [data.location.longitude, data.location.latitude],
      },
    });
    return terry;
  }

  async updateTerry(data: TerryUpdateInputDto, terryId: string) {
    const savedTerry = await this.terryRepo.findByIdOrFail(terryId);
    const terry = await this.terryRepo.updateById(terryId, {
      ...data,
      location: {
        type: MongoLocationType.POINT,
        coordinates: [
          data.location?.longitude || savedTerry.location.coordinates[0],
          data.location?.latitude || savedTerry.location.coordinates[1],
        ],
      },
    });
    return terry;
  }

  async deleteTerry(terryId: string, profileId: string) {
    await this.terryRepo.deleteOne({ _id: terryId, profileId });
  }

  async filterTerries(
    data: TerryFilterInputDto,
    profileId: string,
    pagination: IPagination,
  ) {
    const { queryWithoutPagination, queryWithPagination } =
      this.terrySearchHelper.convertTerryFilterDtoToMongoAggregation(
        {
          ...data,
          profileId,
        },
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
