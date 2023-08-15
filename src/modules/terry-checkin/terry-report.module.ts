import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserMiddleware } from 'src/middlewares/user.middleware';
import { AccountCoreModule } from '../account/accounts.core.module';
import { CommonModule } from '../common/common.module';
import { ProfileCoreModule } from '../profile/profile.core.module';
import { TerryCheckinCoreModule } from './terry-checkin.core.module';
import { TerryCheckinService } from './providers/terry-checkin.service';
import { TerryCheckinController } from './controllers/terry-checkin.controller';
import { TerryCoreModule } from '../terry/terry.core.module';

@Module({
  imports: [
    TerryCheckinCoreModule,
    ProfileCoreModule,
    AccountCoreModule,
    CommonModule,
    TerryCoreModule,
  ],
  providers: [TerryCheckinService],
  controllers: [TerryCheckinController],
})
export class TerryCheckinModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes(TerryCheckinController);
  }
}
