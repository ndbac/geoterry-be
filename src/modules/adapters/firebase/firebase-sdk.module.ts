import { Module } from '@nestjs/common';
import { FcmService, fcmProvider } from './fcm.provider';
import { RtdbService, rtdbProvider } from './rtdb.provider';

@Module({
  providers: [fcmProvider, FcmService, RtdbService, rtdbProvider],
  exports: [fcmProvider, FcmService, RtdbService, rtdbProvider],
})
export class FirebaseModule {}
