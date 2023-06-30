import _ from 'lodash';
import { isAxiosError, isHttpException } from 'src/errors/errors';
import { convertErrorToLogData } from '../helpers';
import { winstonLogger } from './winston.logger';

export const infoLog = (data: any, message?: string) => {
  winstonLogger.info(message || '', { data });
};

export const debugLog = (data: any, message?: string) => {
  winstonLogger.debug(message || '', { data });
};

export const errorLog = (err: any, context?: any, message?: string) => {
  let data = {};
  if (isHttpException(err)) {
    data = { response: err.getResponse(), statusCode: err.getStatus() };
  }
  if (isAxiosError(err)) {
    data = { body: err.response?.data, statusCode: err.response?.status };
  }
  if (_.isEmpty(data)) {
    data = convertErrorToLogData(err);
  }
  winstonLogger.error(message || '', { data: { err: data, context } });
};
