import { Injectable } from '@nestjs/common';
import { UpdateStoreReqDto } from '../dto/update-store.dto';
import { StoreRepository } from '../store.repository';
import { ICreateStoreData } from '../store.types';
import { throwStandardError } from 'src/errors/helpers';
import { ErrorCode } from 'src/errors/error-defs';

@Injectable()
export class SellerStoreService {
  constructor(private readonly storeRepo: StoreRepository) {}

  async onboardStore(input: ICreateStoreData) {
    return this.storeRepo.withTransaction(async (session) => {
      const store = await this.storeRepo.create(
        {
          userId: input.userId,
          businessName: input.businessName,
          email: input.email,
          phoneNumber: input.phoneNumber,
          address: input.address,
          currency: input.currency,
          logoUrl: input.logoUrl,
          languageCode: input.languageCode,
          slug: input.slug,
        },
        { session },
      );
      return store;
    });
  }

  async readStore(userId: string) {
    return this.storeRepo.findOneOrFail({
      userId,
    });
  }

  async updateStore(userId: string, input: UpdateStoreReqDto) {
    await this.storeRepo.withTransaction(async (session) => {
      const store = await this.storeRepo.findOneOrFail(
        {
          userId,
        },
        { session },
      );

      // check if slug is already taken
      if (input?.slug) {
        const existedSlug = await this.storeRepo.exists(
          {
            slug: input.slug,
            userId: { $nin: [userId] },
          },
          { session },
        );
        if (existedSlug) {
          return throwStandardError(ErrorCode.DUPLICATED_SLUG);
        }
      }
      return this.storeRepo.updateById(store.id, input, { session });
    });
  }
}
