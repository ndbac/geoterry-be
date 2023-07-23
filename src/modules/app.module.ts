import { Module } from '@nestjs/common';
import { AccountModule } from './account/accounts.module';
import { DBRootModule } from './adapters/db/db-root.module';
import { HealthModule } from './health/health.module';
import { ProfileModule } from './profile/profile.module';
import { TerryModule } from './terry/terry.module';

@Module({
  imports: [
    DBRootModule.forMongo(),
    HealthModule,
    AccountModule,
    ProfileModule,
    TerryModule,
  ],
})
export class AppModule {}
