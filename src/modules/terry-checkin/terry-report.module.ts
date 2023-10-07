import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserMiddleware } from 'src/middlewares/user.middleware';
import { AccountCoreModule } from '../account/accounts.core.module';
import { CommonModule } from '../common/common.module';
import { ProfileCoreModule } from '../profile/profile.core.module';
import { TerryCheckinCoreModule } from './terry-checkin.core.module';
import { TerryCheckinService } from './providers/terry-checkin.service';
import { TerryCheckinController } from './controllers/terry-checkin.controller';
import { TerryCoreModule } from '../terry/terry.core.module';
import { PublicTerryCheckinService } from './providers/public-terry-checkin.service';
import { PublicTerryCheckinController } from './controllers/public-terry-checkin.controller';
import { TerryUserMappingCoreModule } from '../terry-user-mapping/terry-user-mapping.core.module';

@Module({
  imports: [
    TerryCheckinCoreModule,
    ProfileCoreModule,
    AccountCoreModule,
    CommonModule,
    TerryCoreModule,
    TerryUserMappingCoreModule,
  ],
  providers: [TerryCheckinService, PublicTerryCheckinService],
  controllers: [TerryCheckinController, PublicTerryCheckinController],
})
export class TerryCheckinModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes(TerryCheckinController);
  }
}
