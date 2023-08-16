import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProfileCoreModule } from './profile.core.module';
import { UserMiddleware } from 'src/middlewares/user.middleware';
import { AccountCoreModule } from '../account/accounts.core.module';
import { CommonModule } from '../common/common.module';
import { UserProfileController } from './controllers/user-profile.controller';
import { UserProfileService } from './providers/user-profile.service';
import { AwsSdkModule } from '../adapters/aws/aws-sdk.module';
import { PublicProfileController } from './controllers/public-profile.controller';
import { PublicProfileService } from './providers/public-profile.service';

@Module({
  imports: [ProfileCoreModule, AccountCoreModule, CommonModule, AwsSdkModule],
  providers: [UserProfileService, PublicProfileService],
  controllers: [UserProfileController, PublicProfileController],
})
export class ProfileModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes(UserProfileController);
  }
}
