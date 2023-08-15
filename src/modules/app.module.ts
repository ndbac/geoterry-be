import { Module } from '@nestjs/common';
import { AccountModule } from './account/accounts.module';
import { DBRootModule } from './adapters/db/db-root.module';
import { HealthModule } from './health/health.module';
import { ProfileModule } from './profile/profile.module';
import { TerryModule } from './terry/terry.module';
import { TerryCategoryModule } from './terry-category/terry-category.module';
import { TerryReportModule } from './terry-report/terry-report.module';

@Module({
  imports: [
    DBRootModule.forMongo(),
    HealthModule,
    AccountModule,
    ProfileModule,
    TerryModule,
    TerryCategoryModule,
    TerryReportModule,
  ],
})
export class AppModule {}
