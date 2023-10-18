import { HttpStatus } from '@nestjs/common';
import { IEndpointConfiguration } from 'src/shared/types';
import {
  AccountLoginInputDto,
  AccountRefreshToken,
  AccountUpdateCredentialsDto,
} from '../dto/account-login.dto';
import {
  RecoverAccountDto,
  VerifyAccountRecoverOTPDto,
  VerifyAccountRecoverOTPResDto,
} from '../dto/account-recover.dto';
import { AccountResponseDto } from '../dto/account.response.dto';
import {
  CreateAccountDto,
  SendVerificationDto,
} from '../dto/create-account.dto';

export enum EAccountOperation {
  CREATE_ACCOUNT = 'createAccount',
  SEND_ACCOUNT_VERIFY_CODE = 'sendAccountVerifyCode',
  ACCOUNT_LOGIN = 'accountLogin',
  REFRESH_TOKEN = 'refreshToken',
  ACCOUNT_RECOVER = 'accountRecover',
  ACCOUNT_UPDATE_CREDENTIALS = 'accountUpdateCredentials',
  VERIFY_ACCOUNT_RECOVERY_OTP = 'verifyAccountRecoveryOTP',
  TEAR_DOWN_ACCOUNT = 'teardownAccount',
}

export const ACCOUNT_ENDPOINT_CONFIG: Record<
  EAccountOperation,
  IEndpointConfiguration
> = {
  [EAccountOperation.CREATE_ACCOUNT]: {
    operationId: EAccountOperation.CREATE_ACCOUNT,
    summary: 'Create account',
    body: {
      type: CreateAccountDto,
    },
    responses: [
      {
        type: AccountResponseDto,
        status: HttpStatus.OK,
      },
    ],
  },
  [EAccountOperation.SEND_ACCOUNT_VERIFY_CODE]: {
    operationId: EAccountOperation.SEND_ACCOUNT_VERIFY_CODE,
    summary: 'Send account verify code',
    body: {
      type: SendVerificationDto,
    },
    responses: [
      {
        status: HttpStatus.ACCEPTED,
      },
    ],
  },
  [EAccountOperation.ACCOUNT_LOGIN]: {
    operationId: EAccountOperation.ACCOUNT_LOGIN,
    summary: 'Account login',
    body: {
      type: AccountLoginInputDto,
    },
    responses: [
      {
        type: AccountResponseDto,
        status: HttpStatus.ACCEPTED,
      },
    ],
  },
  [EAccountOperation.REFRESH_TOKEN]: {
    operationId: EAccountOperation.REFRESH_TOKEN,
    summary: 'Refresh token',
    body: {
      type: AccountRefreshToken,
    },
    responses: [
      {
        type: AccountResponseDto,
        status: HttpStatus.ACCEPTED,
      },
    ],
  },
  [EAccountOperation.ACCOUNT_RECOVER]: {
    operationId: EAccountOperation.ACCOUNT_RECOVER,
    summary: 'Recover account',
    body: {
      type: RecoverAccountDto,
    },
    responses: [
      {
        type: AccountResponseDto,
        status: HttpStatus.OK,
      },
    ],
  },
  [EAccountOperation.ACCOUNT_UPDATE_CREDENTIALS]: {
    operationId: EAccountOperation.ACCOUNT_UPDATE_CREDENTIALS,
    summary: 'Update account credentials',
    body: {
      type: AccountUpdateCredentialsDto,
    },
    responses: [
      {
        type: AccountResponseDto,
        status: HttpStatus.OK,
      },
    ],
  },
  [EAccountOperation.VERIFY_ACCOUNT_RECOVERY_OTP]: {
    operationId: EAccountOperation.VERIFY_ACCOUNT_RECOVERY_OTP,
    summary: 'Verify account recovery otp',
    body: {
      type: VerifyAccountRecoverOTPDto,
    },
    responses: [
      {
        type: VerifyAccountRecoverOTPResDto,
        status: HttpStatus.OK,
      },
    ],
  },
  [EAccountOperation.TEAR_DOWN_ACCOUNT]: {
    operationId: EAccountOperation.TEAR_DOWN_ACCOUNT,
    summary: 'Tear down account',
    responses: [
      {
        status: HttpStatus.OK,
      },
    ],
  },
};
