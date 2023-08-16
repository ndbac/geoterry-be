import { Module } from '@nestjs/common';
import { FcmService, fcmProvider } from './fcm.provider';

@Module({
  providers: [fcmProvider, FcmService],
  exports: [fcmProvider, FcmService],
})
export class FirebaseModule {}
