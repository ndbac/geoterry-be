import { TerryDocument } from './terry.model';
import {
  Injectable,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/shared/mongoose/base.repository';
import { CollectionName } from 'src/shared/types';

@Injectable()
export class TerryRepository
  extends BaseRepository<TerryDocument>
  implements OnApplicationBootstrap
{
  constructor(
    @InjectModel(CollectionName.TERRIES)
    model: Model<TerryDocument>,
  ) {
    super(model);
  }

  throwErrorNotFound(): never {
    throw new NotFoundException({
      sentryAlertDisabled: true,
      message: 'Not found',
    });
  }

  async onApplicationBootstrap() {
    await this.createCollection();
  }
}
