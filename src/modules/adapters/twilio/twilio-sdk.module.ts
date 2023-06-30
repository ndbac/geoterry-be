import { Module } from '@nestjs/common';
import { TwilioService, twilioProvider } from './twilio.provider';

@Module({
  providers: [twilioProvider, TwilioService],
  exports: [twilioProvider, TwilioService],
})
export class TwilioSdkModule {}
