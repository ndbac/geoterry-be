import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ErrorCode } from 'src/errors/error-defs';
import { throwStandardError } from 'src/errors/helpers';
import { BaseRepository } from 'src/shared/mongoose/base.repository';
import { CollectionName } from 'src/shared/types';
import { StoreDocument } from './store.model';

@Injectable()
export class StoreRepository
  extends BaseRepository<StoreDocument>
  implements OnApplicationBootstrap
{
  constructor(
    @InjectModel(CollectionName.STORES)
    model: Model<StoreDocument>,
  ) {
    super(model);
  }

  throwErrorNotFound() {
    return throwStandardError(ErrorCode.STORE_NOT_FOUND);
  }

  async onApplicationBootstrap() {
    await this.createCollection();
  }
}
