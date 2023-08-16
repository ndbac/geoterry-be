import { Injectable } from '@nestjs/common';
import { NotificationHistoryRepository } from '../notification-history.repository';
import { NotificationInputDto } from '../dto/notification-input.dto';
import { FcmService } from 'src/modules/adapters/firebase/fcm.provider';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notiHistoryRepo: NotificationHistoryRepository,
    private readonly fcmService: FcmService,
  ) {}

  async pushNotification(input: NotificationInputDto) {
    await this.notiHistoryRepo.withTransaction(async (session) => {
      await this.fcmService.sendPushNotification(
        'need-to-place-a-real-token-from-device-module',
        input.metadata,
      );
      return this.notiHistoryRepo.create({ ...input }, { session });
    });
  }
}
