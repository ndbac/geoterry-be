import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserMiddleware } from 'src/middlewares/user.middleware';
import { AccountCoreModule } from '../account/accounts.core.module';
import { CommonModule } from '../common/common.module';
import { ProfileCoreModule } from '../profile/profile.core.module';
import { NotifcationHistoryCoreModule } from './notification-history.core.module';
import { NotificationService } from './providers/notification.service';
import { NotificationController } from './controllers/notification.controller';
import { FirebaseModule } from '../adapters/firebase/firebase-sdk.module';
import { DeviceCoreModule } from '../device/device.core.module';

@Module({
  imports: [
    NotifcationHistoryCoreModule,
    ProfileCoreModule,
    AccountCoreModule,
    CommonModule,
    FirebaseModule,
    DeviceCoreModule,
  ],
  providers: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes(NotificationController);
  }
}
