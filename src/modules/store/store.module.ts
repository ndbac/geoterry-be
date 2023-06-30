import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { StoreCoreModule } from './store.core.module';
import { UserMiddleware } from 'src/middlewares/user.middleware';
import { AccountCoreModule } from '../account/accounts.core.module';
import { CommonModule } from '../common/common.module';
import { SellerStoreController } from './controllers/seller-store.controller';
import { SellerStoreService } from './providers/seller-store.service';
import { AwsSdkModule } from '../adapters/aws/aws-sdk.module';
import { PublicStoreController } from './controllers/public-store.controller';
import { PublicStoreService } from './providers/public-store.service';

@Module({
  imports: [StoreCoreModule, AccountCoreModule, CommonModule, AwsSdkModule],
  providers: [SellerStoreService, PublicStoreService],
  controllers: [SellerStoreController, PublicStoreController],
})
export class StoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes(SellerStoreController);
  }
}
