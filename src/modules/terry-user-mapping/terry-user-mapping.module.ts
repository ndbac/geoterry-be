import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserMiddleware } from 'src/middlewares/user.middleware';
import { AccountCoreModule } from '../account/accounts.core.module';
import { CommonModule } from '../common/common.module';
import { ProfileCoreModule } from '../profile/profile.core.module';
import { TerryUserMappingCoreModule } from './terry-user-mapping.core.module';
import { TerryUserMappingService } from './providers/terry-user-mapping.service';
import { TerryUserMappingController } from './controllers/terry-user-mapping.controller';
import { TerryCoreModule } from '../terry/terry.core.module';

@Module({
  imports: [
    TerryUserMappingCoreModule,
    ProfileCoreModule,
    AccountCoreModule,
    CommonModule,
    TerryCoreModule,
  ],
  providers: [TerryUserMappingService],
  controllers: [TerryUserMappingController],
})
export class TerryUserMappingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes(TerryUserMappingController);
  }
}
