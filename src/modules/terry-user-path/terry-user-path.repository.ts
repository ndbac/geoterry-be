import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/shared/mongoose/base.repository';
import { CollectionName } from 'src/shared/types';
import { TerryUserPathDocument } from './terry-user-path.model';

/**
 * @deprecated since move to use terry-user-mapping
 */
@Injectable()
export class TerryUserPathRepository
  extends BaseRepository<TerryUserPathDocument>
  implements OnApplicationBootstrap
{
  constructor(
    @InjectModel(CollectionName.TERRY_USER_PATHS)
    model: Model<TerryUserPathDocument>,
  ) {
    super(model);
  }

  async onApplicationBootstrap() {
    await this.createCollection();
  }
}
