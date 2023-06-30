import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import config from 'config';
import { Twilio } from 'twilio';
import { EVerificationStatus } from './types';

export const TWILIO_PROVIDER = 'geoterry-be-twilio';
export const TWILIO_RATE_LIMIT_KEY = 'geoterry_twilio_verification_rate_limit';

export const twilioProvider = {
  provide: TWILIO_PROVIDER,
  useFactory: (): Twilio => {
    const twilio = new Twilio(
      config.get<string>('twilio.sid'),
      config.get<string>('twilio.authToken'),
    );
    return twilio;
  },
};

@Injectable()
export class TwilioService {
  constructor(
    @Inject(TWILIO_PROVIDER)
    private readonly twilio: Twilio,
  ) {}

  async sendOTPCode(phoneNumber: string) {
    return this.twilio.verify.v2
      .services(config.get<string>('twilio.otpSmsSid'))
      .verifications.create({
        to: phoneNumber,
        channel: 'sms',
        rateLimits: {
          [TWILIO_RATE_LIMIT_KEY]: phoneNumber,
        },
      });
  }

  async verifyOTPCode(otpCode: string, phoneNumber: string) {
    try {
      const res = await this.twilio.verify.v2
        .services(config.get<string>('twilio.otpSmsSid'))
        .verificationChecks.create({ code: otpCode, to: phoneNumber });
      return res;
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND)
        return { status: EVerificationStatus.CANCELED };
      return error;
    }
  }
}
