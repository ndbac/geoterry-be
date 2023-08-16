import { Module } from '@nestjs/common';
import { AccountModule } from './account/accounts.module';
import { DBRootModule } from './adapters/db/db-root.module';
import { HealthModule } from './health/health.module';
import { ProfileModule } from './profile/profile.module';
import { TerryModule } from './terry/terry.module';
import { TerryCategoryModule } from './terry-category/terry-category.module';
import { TerryReportModule } from './terry-report/terry-report.module';
import { TerryCheckinModule } from './terry-checkin/terry-report.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    DBRootModule.forMongo(),
    HealthModule,
    AccountModule,
    ProfileModule,
    TerryModule,
    TerryCategoryModule,
    TerryReportModule,
    TerryCheckinModule,
    NotificationModule,
  ],
})
export class AppModule {}
