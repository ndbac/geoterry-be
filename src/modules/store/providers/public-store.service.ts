import { Injectable } from '@nestjs/common';
import { StoreRepository } from '../store.repository';
import { PublicReadStoreQueryDto } from '../dto/store.dto';
import { ECommonFindAspects } from 'src/shared/types';

@Injectable()
export class PublicStoreService {
  constructor(private readonly storeRepo: StoreRepository) {}

  async readStore(slug: string, query: PublicReadStoreQueryDto) {
    if (query.findBy === ECommonFindAspects.ID) {
      return this.storeRepo.findByIdOrFail(slug);
    }
    return this.storeRepo.findOneOrFail({ slug });
  }
}
