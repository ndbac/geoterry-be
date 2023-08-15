import { Injectable } from '@nestjs/common';
import { TerryCheckinRepository } from '../terry-checkin.repository';
import { IPagination } from 'src/shared/types';
import { getPaginationHeaders } from 'src/shared/pagination.helpers';

@Injectable()
export class PublicTerryCheckinService {
  constructor(private readonly terryCheckinRepo: TerryCheckinRepository) {}

  async getCheckinsOfTerry(terryId: string, pagination: IPagination) {
    const data = await this.terryCheckinRepo.find(
      { terryId },
      {
        skip: pagination.offset,
        limit: pagination.pageSize,
        sort: { createdAt: -1 },
      },
    );
    const total = await this.terryCheckinRepo.countWithFindOption({ terryId });
    return {
      items: data,
      headers: getPaginationHeaders(pagination, total),
    };
  }
}
