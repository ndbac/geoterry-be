import { Injectable } from '@nestjs/common';
import { AppGlobalRepository } from '../app-global.repository';
import { EAppGlobalType } from '../types';

@Injectable()
export class AppGlobalService {
  constructor(private readonly appGlobalRepo: AppGlobalRepository) {}

  async getFeatureFlags() {
    return this.appGlobalRepo.findOneOrFail(
      { type: EAppGlobalType.FEATURE_FLAGS },
      {
        sort: {
          updatedAt: -1,
        },
      },
    );
  }

  async getVersionConfiguration() {
    return this.appGlobalRepo.findOneOrFail(
      { type: EAppGlobalType.VERSION_CONFIG },
      {
        sort: {
          updatedAt: -1,
        },
      },
    );
  }
}
