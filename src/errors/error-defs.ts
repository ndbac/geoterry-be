import { HttpStatus } from '@nestjs/common';

export enum ErrorCode {
  UNKNOWN_ERROR = 'GEOTERRY_ERROR_0000',
  INVALID_TOKEN = 'GEOTERRY_ERROR_0001',
  PROFILE_NOT_FOUND = 'GEOTERRY_ERROR_0002',
  FORBIDDEN_PROFILE_ACCESS = 'GEOTERRY_ERROR_0003',
  INCORRECT_OTP = 'GEOTERRY_ERROR_0004',
  ALREADY_ONBOARD_IDENTIFIER = 'GEOTERRY_ERROR_0005',
  INCORRECT_PASSWORD = 'GEOTERRY_ERROR_0006',
  UPLOAD_FILE_FAILED = 'GEOTERRY_ERROR_0007',
  SIZE_IMAGE_NOT_ACCEPTED = 'GEOTERRY_ERROR_0008',
  FAILED_TO_REFRESH_TOKEN = 'GEOTERRY_ERROR_0009',
  DUPLICATED_NAME = 'GEOTERRY_ERROR_0010',
  DUPLICATED_SLUG = 'GEOTERRY_ERROR_0011',
  ALREADY_ONBOARD_PROFILE = 'GEOTERRY_ERROR_0012',
  CANNOT_GENERATE_QR_CODE = 'GEOTERRY_ERROR_0013',
  INVALID_TERRY = 'GEOTERRY_ERROR_0014',
  OUT_OF_DISTANCE = 'GEOTERRY_ERROR_0015',
  INCORRECT_VERIFY_CODE = 'GEOTERRY_ERROR_0016',
}

export const ERROR_DEFS: Record<
  string,
  { statusCode: HttpStatus | number } | undefined
> = {
  [ErrorCode.INVALID_TOKEN]: {
    statusCode: HttpStatus.UNAUTHORIZED,
  },
  [ErrorCode.PROFILE_NOT_FOUND]: {
    statusCode: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.FORBIDDEN_PROFILE_ACCESS]: {
    statusCode: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.INCORRECT_OTP]: {
    statusCode: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.ALREADY_ONBOARD_IDENTIFIER]: {
    statusCode: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.INCORRECT_PASSWORD]: {
    statusCode: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.UPLOAD_FILE_FAILED]: {
    statusCode: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.SIZE_IMAGE_NOT_ACCEPTED]: {
    statusCode: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.CANNOT_GENERATE_QR_CODE]: {
    statusCode: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.FAILED_TO_REFRESH_TOKEN]: {
    statusCode: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.DUPLICATED_NAME]: {
    statusCode: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.DUPLICATED_SLUG]: {
    statusCode: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.ALREADY_ONBOARD_PROFILE]: {
    statusCode: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.INVALID_TERRY]: {
    statusCode: HttpStatus.BAD_REQUEST,
  },
  [ErrorCode.OUT_OF_DISTANCE]: {
    statusCode: HttpStatus.BAD_REQUEST,
  },
};
