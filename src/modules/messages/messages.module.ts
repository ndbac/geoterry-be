import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserMiddleware } from 'src/middlewares/user.middleware';
import { AccountCoreModule } from '../account/accounts.core.module';
import { CommonModule } from '../common/common.module';
import { ProfileCoreModule } from '../profile/profile.core.module';
import { MessageCoreModule } from './messages.core.module';
import { MessageController } from './controllers/message.controller';
import { MessageService } from './providers/message.service';
import { ConversationCoreModule } from '../conversations/conversations.core.module';
import { FirebaseModule } from '../adapters/firebase/firebase-sdk.module';
import { DeviceCoreModule } from '../device/device.core.module';
import { NotificationCompilers } from '../notification/providers/noti-compiler';

@Module({
  imports: [
    MessageCoreModule,
    ProfileCoreModule,
    AccountCoreModule,
    CommonModule,
    ConversationCoreModule,
    FirebaseModule,
    DeviceCoreModule,
  ],
  providers: [MessageService, NotificationCompilers],
  controllers: [MessageController],
})
export class MessageModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes(MessageController);
  }
}
