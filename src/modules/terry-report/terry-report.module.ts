import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserMiddleware } from 'src/middlewares/user.middleware';
import { AccountCoreModule } from '../account/accounts.core.module';
import { CommonModule } from '../common/common.module';
import { ProfileCoreModule } from '../profile/profile.core.module';
import { TerryReportCoreModule } from './terry-report.core.module';
import { TerryReportService } from './providers/terry-report.service';
import { TerryReportController } from './controllers/terry-report.controller';

@Module({
  imports: [
    TerryReportCoreModule,
    ProfileCoreModule,
    AccountCoreModule,
    CommonModule,
  ],
  providers: [TerryReportService],
  controllers: [TerryReportController],
})
export class TerryReportModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes(TerryReportController);
  }
}
