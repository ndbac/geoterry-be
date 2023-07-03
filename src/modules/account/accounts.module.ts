import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { GeoterryI18nModule } from '../adapters/i18n.module';
import { TwilioSdkModule } from '../adapters/twilio/twilio-sdk.module';
import { AccountCoreModule } from './accounts.core.module';
import { AccountController } from './controllers/accounts.controller';
import { AccountService } from './providers/account.service';
import { CommonModule } from '../common/common.module';
import { UserMiddleware } from 'src/middlewares/user.middleware';

@Module({
  imports: [
    AccountCoreModule,
    GeoterryI18nModule,
    TwilioSdkModule,
    CommonModule,
  ],
  providers: [AccountService],
  controllers: [AccountController],
})
export class AccountModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes({
      path: `/auth/update-credentials`,
      method: RequestMethod.PUT,
    });
  }
}
