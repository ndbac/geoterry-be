import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/shared/mongoose/base.repository';
import { CollectionName } from 'src/shared/types';
import { TerryReportDocument } from './terry-report.model';

@Injectable()
export class TerryReportRepository
  extends BaseRepository<TerryReportDocument>
  implements OnApplicationBootstrap
{
  constructor(
    @InjectModel(CollectionName.TERRY_REPORTS)
    model: Model<TerryReportDocument>,
  ) {
    super(model);
  }

  async onApplicationBootstrap() {
    await this.createCollection();
  }
}
