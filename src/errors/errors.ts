import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from './error-defs';
import { IGeneralErrorShape } from './errors.type';
import { AxiosError } from 'axios';

export function createGeneralExceptionError(error: any): IGeneralErrorShape {
  if (!!error && error instanceof HttpException) {
    const response = error.getResponse() as any;
    return {
      ...response,
      message: response.message,
      errorCode: response.errorCode || ErrorCode.UNKNOWN_ERROR,
      statusCode: error.getStatus(),
    };
  }
  return {
    message: error.message || 'An unknown error occurred',
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: ErrorCode.UNKNOWN_ERROR,
  };
}

export const isAxiosError = (err: any): err is AxiosError => {
  return !!err?.isAxiosError;
};

export const isHttpException = (err: any): err is HttpException => {
  return err instanceof HttpException;
};
