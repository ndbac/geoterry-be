import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/shared/mongoose/base.repository';
import { CollectionName } from 'src/shared/types';
import { TerryCheckinDocument } from './terry-checkin.model';

@Injectable()
export class TerryCheckinRepository
  extends BaseRepository<TerryCheckinDocument>
  implements OnApplicationBootstrap
{
  constructor(
    @InjectModel(CollectionName.TERRY_CHECKINS)
    model: Model<TerryCheckinDocument>,
  ) {
    super(model);
  }

  async onApplicationBootstrap() {
    await this.createCollection();
  }
}
