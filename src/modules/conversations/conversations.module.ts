import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserMiddleware } from 'src/middlewares/user.middleware';
import { AccountCoreModule } from '../account/accounts.core.module';
import { CommonModule } from '../common/common.module';
import { ProfileCoreModule } from '../profile/profile.core.module';
import { ConversationCoreModule } from './conversations.core.module';
import { ConversationController } from './controllers/conversation.controller';
import { ConversationService } from './providers/conversation.service';
import { MessageCoreModule } from '../messages/messages.core.module';

@Module({
  imports: [
    ConversationCoreModule,
    ProfileCoreModule,
    AccountCoreModule,
    CommonModule,
    MessageCoreModule,
  ],
  providers: [ConversationService],
  controllers: [ConversationController],
})
export class ConversationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes(ConversationController);
  }
}
