import * as Sentry from '@sentry/node';
import config from 'config';
import { errorLog } from './logger/logger.helpers';

export function initializeSentry() {
  const sentry = config.get<{ dsn: string; enabled: boolean }>('sentry');
  if (sentry.enabled) {
    try {
      Sentry.init({
        dsn: sentry.dsn,
      });
    } catch (err) {
      errorLog(err, undefined, 'Exception from sentry initialization');
    }
  }
}
