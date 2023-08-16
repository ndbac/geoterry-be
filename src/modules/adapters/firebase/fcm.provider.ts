import { Inject, Injectable } from '@nestjs/common';
import { Messaging } from 'firebase-admin/messaging';
import { app } from './firebase';
import { INotification, INotificationWithToken } from './types';

export const FCM_PROVIDER = 'geoterry-be-fcm';

export const fcmProvider = {
  provide: FCM_PROVIDER,
  useFactory: (): Messaging => {
    return app.messaging();
  },
};

@Injectable()
export class FcmService {
  constructor(
    @Inject(FCM_PROVIDER)
    private readonly fcm: Messaging,
  ) {}

  async sendPushNotification(token: string, notification: INotification) {
    const response = await this.fcm.send({
      token,
      notification,
    });
    return response;
  }

  async sendBatchPushNotification(messages: INotificationWithToken[]) {
    const response = await this.fcm.sendEach(messages);
    return response;
  }
}
