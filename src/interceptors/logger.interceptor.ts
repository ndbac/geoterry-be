import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { errorLog, infoLog } from 'src/shared/logger/logger.helpers';

export class LoggerInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler) {
    const req = ctx.switchToHttp().getRequest<Request>();

    const reqLogData = {
      id: req['id'],
      method: req.method,
      uri: req.url,
      reqHeaders: {
        ...req.headers,
        authorization: '***',
        'proxy-authorization': '***',
      },
      reqBody: req.body,
    };

    return next.handle().pipe(
      tap((data) => {
        const res = ctx.switchToHttp().getResponse<Response>();
        infoLog(
          {
            ...reqLogData,
            status: res.statusCode,
            resBody: data,
            resHeader: res.getHeaders(),
          },
          'App request-response',
        );
      }),
      catchError((err) => {
        errorLog(err, { req: reqLogData }, 'App exception occurs');
        return throwError(() => err);
      }),
    );
  }
}
