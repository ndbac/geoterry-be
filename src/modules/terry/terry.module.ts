import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TerryCoreModule } from './terry.core.module';
import { TerryController } from './controllers/terry.controller';
import { TerryService } from './providers/terry.service';
import { UserMiddleware } from 'src/middlewares/user.middleware';
import { AccountCoreModule } from '../account/accounts.core.module';
import { CommonModule } from '../common/common.module';
import { ProfileCoreModule } from '../profile/profile.core.module';
import { TerrySearchHelper } from './providers/terry-search.helper';

@Module({
  imports: [
    TerryCoreModule,
    AccountCoreModule,
    CommonModule,
    ProfileCoreModule,
  ],
  providers: [TerryService, TerrySearchHelper],
  controllers: [TerryController],
})
export class TerryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes(TerryController);
  }
}
