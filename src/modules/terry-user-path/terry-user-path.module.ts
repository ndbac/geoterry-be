import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserMiddleware } from 'src/middlewares/user.middleware';
import { AccountCoreModule } from '../account/accounts.core.module';
import { CommonModule } from '../common/common.module';
import { ProfileCoreModule } from '../profile/profile.core.module';
import { TerryUserPathCoreModule } from './terry-user-path.core.module';
import { TerryUserPathService } from './providers/terry-user-path.service';
import { TerryUserPathController } from './controllers/terry-user-path.controller';
import { TerryCoreModule } from '../terry/terry.core.module';
import { TerryUserMappingCoreModule } from '../terry-user-mapping/terry-user-mapping.core.module';

@Module({
  imports: [
    TerryUserPathCoreModule,
    ProfileCoreModule,
    AccountCoreModule,
    CommonModule,
    TerryCoreModule,
    TerryUserMappingCoreModule,
  ],
  providers: [TerryUserPathService],
  controllers: [TerryUserPathController],
})
export class TerryUserPathModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes(TerryUserPathController);
  }
}
