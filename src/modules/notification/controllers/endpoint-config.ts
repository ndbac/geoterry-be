import { HttpStatus } from '@nestjs/common';
import { IEndpointConfiguration } from 'src/shared/types';
import { NotificationInputDto } from '../dto/notification-input.dto';
import { NotificationHistoryResDto } from '../dto/notification-res.dto';

export enum ENotificationOperation {
  ADMIN_PUSH_NOTIFICATION = 'adminPushNotification',
}

export const NOTIFITION_ENDPOINT_CONFIG: Record<
  ENotificationOperation,
  IEndpointConfiguration
> = {
  [ENotificationOperation.ADMIN_PUSH_NOTIFICATION]: {
    operationId: ENotificationOperation.ADMIN_PUSH_NOTIFICATION,
    summary: 'Admin push notification',
    body: {
      type: NotificationInputDto,
    },
    responses: [
      {
        type: NotificationHistoryResDto,
        status: HttpStatus.CREATED,
      },
    ],
  },
};
