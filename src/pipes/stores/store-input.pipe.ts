import { StoreRepository } from 'src/modules/store/store.repository';
import { Injectable, PipeTransform } from '@nestjs/common';
import { SellerCreateStoreInputWithUserContextDto } from 'src/modules/store/dto/create-store.dto';
import slugify from 'slugify';
import { IIamUserData } from 'src/guards/types';
import { ErrorCode } from 'src/errors/error-defs';
import { throwStandardError } from 'src/errors/helpers';

@Injectable()
export class StoreInputTransformerPipe implements PipeTransform {
  constructor(private readonly storeRepo: StoreRepository) {}

  transform(value: SellerCreateStoreInputWithUserContextDto) {
    return this.transformCreateStoreData(value);
  }

  async transformCreateStoreData({
    data,
    user,
  }: SellerCreateStoreInputWithUserContextDto) {
    await this.isEligibleToCreateStore(user);

    const slug = slugify(data.businessName) || Date.now();
    const isExistedSlug = await this.storeRepo.exists({ slug });
    return {
      user,
      data: {
        ...data,
        userId: user.userId,
        slug: isExistedSlug ? `${slug}-${Date.now()}` : slug,
      },
    };
  }

  private async isEligibleToCreateStore(user: IIamUserData) {
    const isExistedStore = await this.storeRepo.exists({ userId: user.userId });
    if (isExistedStore) throwStandardError(ErrorCode.ALREADY_ONBOARD_STORE);
  }
}
