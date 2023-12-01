import { Module } from '@nestjs/common';
import { AppGlobalCoreModule } from './app-global.core.module';
import { AppGlobalService } from './providers/app-global.service';
import { AppGlobalController } from './controllers/public-app-global.controller';

@Module({
  imports: [AppGlobalCoreModule],
  providers: [AppGlobalService],
  controllers: [AppGlobalController],
})
export class AppGlobalModule {}
