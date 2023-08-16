import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/shared/mongoose/base.repository';
import { CollectionName } from 'src/shared/types';
import { NotificationHistoryDocument } from './notification-history.model';

@Injectable()
export class NotificationHistoryRepository
  extends BaseRepository<NotificationHistoryDocument>
  implements OnApplicationBootstrap
{
  constructor(
    @InjectModel(CollectionName.NOTIFICATION_HISTORIES)
    model: Model<NotificationHistoryDocument>,
  ) {
    super(model);
  }

  async onApplicationBootstrap() {
    await this.createCollection();
  }
}
