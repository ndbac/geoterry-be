import { config as envConfig } from 'dotenv';
envConfig();
import config from 'config';
import { Twilio } from 'twilio';
import { runScript } from 'src/shared/script.helpers';
import { parseCommandArgs } from 'src/shared/helpers';
import { TWILIO_RATE_LIMIT_KEY } from 'src/modules/adapters/twilio/twilio.provider';

// node dist/scripts/create-rate-limit-twilio.js --max=2 --interval=60
runScript(async () => {
  const args = parseCommandArgs<{ max: number; interval: number }>();

  const twilio = new Twilio(
    config.get<string>('twilio.sid'),
    config.get<string>('twilio.authToken'),
  );

  const rateLimitDoc = await twilio.verify.v2
    .services(config.get<string>('twilio.otpSmsSid'))
    .rateLimits.create({
      description: 'limit verification sms sending',
      uniqueName:
        TWILIO_RATE_LIMIT_KEY || 'geoterry_twilio_verification_rate_limit',
    });

  const res = await twilio.verify.v2
    .services(config.get<string>('twilio.otpSmsSid'))
    .rateLimits(rateLimitDoc.sid)
    .buckets.create({ max: args.max || 2, interval: args.interval || 60 });

  console.log(res);
}, 'Create rate limit for Twilio service');
