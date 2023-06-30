import {
  Catch,
  HttpException,
  Injectable,
  HttpStatus,
  ArgumentsHost,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { LanguageCode } from 'src/shared/types';
import { createGeneralExceptionError } from 'src/errors/errors';
import { I18nService } from 'nestjs-i18n';
import { ErrorCode } from '../errors/error-defs';
import _ from 'lodash';

@Injectable()
@Catch(HttpException)
export class I18nExceptionFilter extends BaseExceptionFilter {
  constructor(readonly i18n: I18nService) {
    super();
  }
  async catch(err: HttpException, host: ArgumentsHost) {
    const errResponse = err.getResponse() as any;
    const response = host.switchToHttp().getResponse();
    const request = host.switchToHttp().getRequest();
    try {
      let lang: LanguageCode = Object.values(LanguageCode).includes(
        request.headers['language-code'],
      )
        ? request.headers['language-code']
        : LanguageCode.ENGLISH;
      switch (errResponse.languageCode) {
        case LanguageCode.VIETNAMESE:
          lang = LanguageCode.VIETNAMESE;
          break;
        case LanguageCode.TAIWANESE:
          lang = LanguageCode.TAIWANESE;
          break;
      }
      const translatedMsg = Array.isArray(errResponse.message)
        ? [
            ...new Set(
              await Promise.all(
                errResponse.message.map((m: string) => {
                  return this.translateMessage(m, lang, errResponse.args);
                }),
              ),
            ),
          ]
        : await this.translateMessage(
            errResponse.message,
            lang,
            errResponse.args,
          );
      errResponse.message = translatedMsg;
      const responseErr = createGeneralExceptionError(err);
      response.status(responseErr.statusCode).json(Object.assign(responseErr));
    } catch (error) {
      if (errResponse.errorCode && errResponse.statusCode) {
        const responseErr = createGeneralExceptionError(err);
        response
          .status(errResponse.statusCode)
          .json(Object.assign(_.omit(responseErr, ['config'])));
      } else {
        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          errorCode: ErrorCode.UNKNOWN_ERROR,
          message: 'Something wrong happens. Check immediately',
        });
      }
    }
  }

  private async translateMessage(
    message: string,
    lang: LanguageCode,
    args?: Record<string, any>,
  ) {
    const translatedMsg = await this.i18n.translate(
      message.includes('i18n.')
        ? message?.split('i18n.')[1]
        : message.substring(message?.indexOf('validation')),
      { lang, args },
    );
    return translatedMsg;
  }
}
