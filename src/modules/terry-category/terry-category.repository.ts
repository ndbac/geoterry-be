import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/shared/mongoose/base.repository';
import { CollectionName } from 'src/shared/types';
import { TerryCategoryDocument } from './terry-category.model';

@Injectable()
export class TerryCategoryRepository
  extends BaseRepository<TerryCategoryDocument>
  implements OnApplicationBootstrap
{
  constructor(
    @InjectModel(CollectionName.TERRY_CATEGORIES)
    model: Model<TerryCategoryDocument>,
  ) {
    super(model);
  }

  async onApplicationBootstrap() {
    await this.createCollection();
  }
}
