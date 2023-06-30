import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import * as Sentry from '@sentry/minimal';
import _ from 'lodash';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      catchError((err) => {
        this.captureUnexpectedError(err);
        return throwError(() => err);
      }),
    );
  }

  private captureUnexpectedError(err: any) {
    if (
      err instanceof HttpException &&
      (!_.isNil(err.getResponse()['errorCode']) ||
        (err.getResponse() as any).sentryAlertDisabled)
    ) {
      return;
    }
    Sentry.captureException(err);
  }
}
