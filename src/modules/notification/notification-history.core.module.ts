import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CollectionName } from 'src/shared/types';
import { NotificationHistoryDocument } from './notification-history.model';
import { NotificationHistoryRepository } from './notification-history.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CollectionName.NOTIFICATION_HISTORIES,
        schema: NotificationHistoryDocument.schema,
      },
    ]),
  ],
  providers: [NotificationHistoryRepository],
  exports: [NotificationHistoryRepository],
})
export class NotifcationHistoryCoreModule {}
