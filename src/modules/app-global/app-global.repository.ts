import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/shared/mongoose/base.repository';
import { CollectionName } from 'src/shared/types';
import { AppGlobalDocument } from './app-global.model';

@Injectable()
export class AppGlobalRepository
  extends BaseRepository<AppGlobalDocument>
  implements OnApplicationBootstrap
{
  constructor(
    @InjectModel(CollectionName.APP_GLOBALS)
    model: Model<AppGlobalDocument>,
  ) {
    super(model);
  }

  async onApplicationBootstrap() {
    await this.createCollection();
  }
}
