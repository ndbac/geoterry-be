import { Injectable } from '@nestjs/common';
import { TerryRepository } from '../terry.repository';
import { TerryFilterInputDto } from '../dto/terry-filter.dto';
import { IPagination } from 'src/shared/types';
import { TerrySearchHelper } from './terry-search.helper';
import { getPaginationHeaders } from 'src/shared/pagination.helpers';

@Injectable()
export class HunterTerryService {
  constructor(
    private readonly terryRepo: TerryRepository,
    private readonly terrySearchHelper: TerrySearchHelper,
  ) {}

  async getTerryById(terryId: string) {
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
