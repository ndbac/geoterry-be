import { DeviceDocument } from './device.model';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/shared/mongoose/base.repository';
import { CollectionName } from 'src/shared/types';

@Injectable()
export class DeviceRepository
  extends BaseRepository<DeviceDocument>
  implements OnApplicationBootstrap
{
  constructor(
    @InjectModel(CollectionName.DEVICES)
    readonly model: Model<DeviceDocument>,
  ) {
    super(model);
  }

  async onApplicationBootstrap() {
    await this.createCollection();
  }
}
