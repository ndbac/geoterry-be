import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/shared/mongoose/base.repository';
import { CollectionName } from 'src/shared/types';
import { TerryUserMappingDocument } from './terry-user-mapping.model';

@Injectable()
export class TerryUserMappingRepository
  extends BaseRepository<TerryUserMappingDocument>
  implements OnApplicationBootstrap
{
  constructor(
    @InjectModel(CollectionName.TERRY_USER_MAPPINGS)
    model: Model<TerryUserMappingDocument>,
  ) {
    super(model);
  }

  async onApplicationBootstrap() {
    await this.createCollection();
  }
}
