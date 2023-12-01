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
import { DeviceModule } from './device/device.module';
import { WebsocketModule } from './adapters/websocket/websocket.module';
import { ConversationModule } from './conversations/conversations.module';
import { MessageModule } from './messages/messages.module';
import { TerryUserMappingModule } from './terry-user-mapping/terry-user-mapping.module';
import { TerryUserPathModule } from './terry-user-path/terry-user-path.module';
import { AppGlobalModule } from './app-global/app-global.module';

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
    DeviceModule,
    WebsocketModule,
    ConversationModule,
    MessageModule,
    TerryUserMappingModule,
    TerryUserPathModule,
    AppGlobalModule,
  ],
})
export class AppModule {}
