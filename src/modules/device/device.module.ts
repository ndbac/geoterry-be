import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DeviceController } from './controllers/device.controller';
import { DeviceCoreModule } from './device.core.module';
import { DeviceService } from './providers/device.service';
import { UserMiddleware } from 'src/middlewares/user.middleware';
import { AccountCoreModule } from '../account/accounts.core.module';
import { CommonModule } from '../common/common.module';
import { ProfileCoreModule } from '../profile/profile.core.module';

@Module({
  imports: [
    DeviceCoreModule,
    AccountCoreModule,
    CommonModule,
    ProfileCoreModule,
  ],
  providers: [DeviceService],
  controllers: [DeviceController],
})
export class DeviceModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes(DeviceController);
  }
}
