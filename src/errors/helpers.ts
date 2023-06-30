import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode, ERROR_DEFS } from './error-defs';

export const throwStandardError = (
  errorCode: ErrorCode,
  metadata?: Record<string, any>,
): never => {
  throw new HttpException(
    {
      errorCode,
      message: `general.${errorCode}`,
      ...(metadata && { ...metadata }),
    },
    ERROR_DEFS[errorCode]?.statusCode || HttpStatus.BAD_REQUEST,
  );
};
