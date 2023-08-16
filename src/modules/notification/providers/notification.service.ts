import { Injectable } from '@nestjs/common';
import { NotificationHistoryRepository } from '../notification-history.repository';
import { NotificationInputDto } from '../dto/notification-input.dto';
import { FcmService } from 'src/modules/adapters/firebase/fcm.provider';
import { DeviceRepository } from 'src/modules/device/device.repository';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notiHistoryRepo: NotificationHistoryRepository,
    private readonly fcmService: FcmService,
    private readonly deviceRepo: DeviceRepository,
  ) {}

  async pushNotification(input: NotificationInputDto) {
    await this.notiHistoryRepo.withTransaction(async (session) => {
      const device = await this.deviceRepo.findOneOrFail({
        profileId: input.profileId,
        enabled: true,
      });
      await this.fcmService.sendPushNotification(
        device.fcmToken,
        input.metadata,
      );
      return this.notiHistoryRepo.create({ ...input }, { session });
    });
  }
}
