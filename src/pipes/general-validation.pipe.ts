import {
  ArgumentMetadata,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import _ from 'lodash';

interface ICustomParamValidationPipeOptions extends ValidationPipeOptions {
  excludedTransformKeys: string[];
}

export const generalValidationPipe = new ValidationPipe({
  transform: true,
  whitelist: true,
  validationError: {
    target: true,
    value: false,
  },
  validateCustomDecorators: true,
});

class CustomParamValidationPipe extends ValidationPipe {
  excludedKeys: string[] = [];
  constructor(opts: ICustomParamValidationPipeOptions) {
    super(opts);
    this.excludedKeys = opts.excludedTransformKeys;
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    const excludedValues = {};
    this.excludedKeys.forEach((path) => {
      _.set(excludedValues, path, _.get(value, path));
      _.unset(value, path);
    });
    const afterTransformedValue = await super.transform(value, metadata);
    this.excludedKeys.forEach((path) => {
      _.set(afterTransformedValue, path, _.get(excludedValues, path));
    });
    return afterTransformedValue;
  }
}

export const getCustomParamValidationPipe = (
  options: Pick<ICustomParamValidationPipeOptions, 'excludedTransformKeys'>,
) => {
  return new CustomParamValidationPipe({
    transform: true,
    validationError: {
      target: true,
      value: false,
    },
    whitelist: true,
    validateCustomDecorators: true,
    ...options,
  });
};

export const EXCLUDE_REQ_CTX_VALIDATION_PIPE = getCustomParamValidationPipe({
  excludedTransformKeys: ['profile', 'user', 'url'],
});
