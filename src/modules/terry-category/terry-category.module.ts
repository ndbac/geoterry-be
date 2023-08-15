import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserMiddleware } from 'src/middlewares/user.middleware';
import { AccountCoreModule } from '../account/accounts.core.module';
import { CommonModule } from '../common/common.module';
import { TerryCategoryCoreModule } from './terry-category.core.module';
import { ProfileCoreModule } from '../profile/profile.core.module';
import { PublicTerryCategoryService } from './providers/public-terry-category.service';
import { TerryCategoryService } from './providers/terry-category.service';
import { TerryCategoryController } from './controllers/terry-category.controller';
import { PublicTerryCategoryController } from './controllers/public-terry-category.controller';

@Module({
  imports: [
    TerryCategoryCoreModule,
    ProfileCoreModule,
    AccountCoreModule,
    CommonModule,
  ],
  providers: [TerryCategoryService, PublicTerryCategoryService],
  controllers: [TerryCategoryController, PublicTerryCategoryController],
})
export class TerryCategoryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes(TerryCategoryController);
  }
}
