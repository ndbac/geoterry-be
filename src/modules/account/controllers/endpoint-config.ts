import { HttpStatus } from '@nestjs/common';
import { IEndpointConfiguration } from 'src/shared/types';
import {
  AccountLoginInputDto,
  AccountRefreshToken,
} from '../dto/account-login.dto';
import { RecoverAccountDto } from '../dto/account-recover.dto';
import {
  AccountLoginResDto,
  AccountResponseDto,
} from '../dto/account.response.dto';
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
        type: AccountLoginResDto,
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
        type: AccountLoginResDto,
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
};
