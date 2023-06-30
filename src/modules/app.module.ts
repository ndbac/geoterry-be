import { Module } from '@nestjs/common';
import { AccountModule } from './account/accounts.module';
import { DBRootModule } from './adapters/db/db-root.module';
import { HealthModule } from './health/health.module';
import { StoreModule } from './store/store.module';

@Module({
  imports: [DBRootModule.forMongo(), HealthModule, AccountModule, StoreModule],
})
export class AppModule {}
