import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TerryCoreModule } from './terry.core.module';
import { TerryController } from './controllers/terry.controller';
import { TerryService } from './providers/terry.service';
import { UserMiddleware } from 'src/middlewares/user.middleware';
import { AccountCoreModule } from '../account/accounts.core.module';
import { CommonModule } from '../common/common.module';
import { ProfileCoreModule } from '../profile/profile.core.module';
import { TerrySearchHelper } from './providers/terry-search.helper';
import { PublicTerryController } from './controllers/public-terry.controller';
import { PublicTerryService } from './providers/public-terry.service';

@Module({
  imports: [
    TerryCoreModule,
    AccountCoreModule,
    CommonModule,
    ProfileCoreModule,
  ],
  providers: [TerryService, TerrySearchHelper, PublicTerryService],
  controllers: [TerryController, PublicTerryController],
})
export class TerryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes(TerryController);
  }
}
