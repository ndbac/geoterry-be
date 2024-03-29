import { throwStandardError } from './../../../errors/helpers';
import { IAccountRole, IamNamespace } from './../../../shared/types';
import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { TwilioService } from 'src/modules/adapters/twilio/twilio.provider';
import { EVerificationStatus } from 'src/modules/adapters/twilio/types';
import { EIdentifierType } from 'src/shared/types';
import { AccountRepository } from '../accounts.repository';
import {
  CreateAccountDto,
  SendVerificationDto,
} from '../dto/create-account.dto';
import { BcryptService } from '../../common/bcrypt/bcrypt.service';
import { JwtService } from 'src/modules/common/jsonwebtoken/jwt.service';
import {
  AccountLoginInputDto,
  AccountRefreshToken,
  AccountUpdateCredentialsDto,
} from '../dto/account-login.dto';
import { convertObject } from 'src/shared/mongoose/helpers';
import { JwtPayload } from 'jsonwebtoken';
import { isAfter, sub } from 'date-fns';
import { ErrorCode } from 'src/errors/error-defs';
import {
  RecoverAccountDto,
  VerifyAccountRecoverOTPDto,
} from '../dto/account-recover.dto';
import { AccountDocument } from '../accounts.model';
import { generateRandomString } from 'src/shared/helpers';
import {
  ACCOUNT_RECOVERY_CODE_LENGTH,
  REFRESH_TOKEN_LENGTH,
} from '../constants';
import { SwitchRoleInputDto } from '../dto/account.dto';
import { AccountMetadataRepository } from '../account-metadata.repository';
import { ERoleRequestStatus } from '../types';

@Injectable()
export class AccountService {
  constructor(
    private readonly accountRepo: AccountRepository,
    private readonly twilioService: TwilioService,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
    private readonly accountMetadataRepo: AccountMetadataRepository,
  ) {}

  async sendVerification(input: SendVerificationDto) {
    const account = await this.accountRepo.findOne({
      identifierType: input.identifierType,
      identifier: input.identifier,
      namespace: input.namespace,
    });
    if (
      (!account && !input.isRecoverPassword) ||
      (account && input.isRecoverPassword)
    ) {
      switch (input.identifierType) {
        case EIdentifierType.PHONE_NUMBER: {
          await this.twilioService.sendOTPCode(input.identifier);
          break;
        }
        default:
          throw new BadRequestException({
            message: `Verification through ${input.identifierType} channel is not supported yet!`,
            sentryAlertDisabled: true,
          });
      }
    } else {
      if (input.isRecoverPassword) {
        return throwStandardError(ErrorCode.PROFILE_NOT_FOUND);
      }
      return throwStandardError(ErrorCode.ALREADY_ONBOARD_IDENTIFIER);
    }
  }

  async createAccount(input: CreateAccountDto) {
    // check eligible for creating account
    await this.isEligibleForCreateAccount(input);

    const hashedPassword = await this.bcryptService.hash(input.password);
    const refreshToken = generateRandomString(REFRESH_TOKEN_LENGTH);
    const accountData = {
      credentials: {
        passwordChangedAt: sub(new Date(), { minutes: 5 }), // to make sure that the password is changed before the account is created
        password: hashedPassword,
        refreshToken,
      },
      namespace: input.namespace,
      identifier: input.identifier,
      identifierType: input.identifierType,
    };
    const acc = await this.accountRepo.create(accountData);
    const tokenData = {
      id: acc.id,
      identifier: acc.identifier,
      identifierType: acc.identifierType,
    };
    const accessToken = this.jwtService.signToken(tokenData);
    const convertedAcc = convertObject(acc);
    return {
      ...convertedAcc,
      credentials: {
        ...convertedAcc.credentials,
        token: accessToken,
      },
    };
  }

  async verifyAccountRecoveryOtp(input: VerifyAccountRecoverOTPDto) {
    const account = await this.isAccountOTPCorrect(input);
    const recoveryCode = generateRandomString(ACCOUNT_RECOVERY_CODE_LENGTH);
    await this.accountRepo.updateById(account.id, {
      'credentials.recoveryCode': recoveryCode,
    });
    return {
      recoveryCode,
    };
  }

  async recoverAccount(input: RecoverAccountDto) {
    // check eligible for creating account
    const account = await this.isEligibleForRecoveringAccount(input);

    const hashedPassword = await this.bcryptService.hash(input.password);
    const refreshToken = generateRandomString(REFRESH_TOKEN_LENGTH);
    const updateData = {
      credentials: {
        passwordChangedAt: new Date(),
        password: hashedPassword,
        refreshToken,
        recoveryCode: null,
      },
    };
    const updatedAcc = (await this.accountRepo.updateById(
      account.id,
      updateData,
    )) as AccountDocument;
    const tokenData = {
      id: updatedAcc.id,
      identifier: updatedAcc.identifier,
      identifierType: updatedAcc.identifierType,
    };
    const accessToken = this.jwtService.signToken(tokenData);
    const convertedAcc = convertObject(updatedAcc);
    return {
      ...convertedAcc,
      credentials: {
        ...convertedAcc.credentials,
        token: accessToken,
      },
    };
  }

  async login(input: AccountLoginInputDto) {
    const refreshToken = generateRandomString(REFRESH_TOKEN_LENGTH);
    const account = await this.accountRepo.updateOne(
      {
        identifier: input.identifier,
        identifierType: input.identifierType,
        namespace: input.namespace,
      },
      {
        $set: { 'credentials.refreshToken': refreshToken },
      },
    );
    if (!account) {
      this.accountRepo.throwErrorNotFound();
    }
    if (
      await this.bcryptService.compare(
        input.password,
        account.credentials.password,
      )
    ) {
      const tokenData = {
        id: account.id,
        identifier: account.identifier,
        identifierType: account.identifierType,
      };
      const accessToken = this.jwtService.signToken(tokenData);
      const convertedAcc = convertObject(account);
      return {
        ...convertedAcc,
        credentials: {
          ...convertedAcc.credentials,
          token: accessToken,
          refreshToken,
        },
      };
    }
    return throwStandardError(ErrorCode.INCORRECT_PASSWORD);
  }

  async refreshToken(input: AccountRefreshToken) {
    const tokenData = this.jwtService.decodeToken(input.token) as JwtPayload;
    if (tokenData?.data) {
      const account = await this.accountRepo.findByIdOrFail(tokenData.data?.id);
      if (
        isAfter(
          (tokenData.iat || 0) * 1000,
          account.credentials.passwordChangedAt,
        ) &&
        input.refreshToken === account.credentials.refreshToken
      ) {
        const newTokenData = {
          id: account.id,
          identifier: account.identifier,
          identifierType: account.identifierType,
        };
        const accessToken = this.jwtService.signToken(newTokenData);
        const refreshToken = generateRandomString(REFRESH_TOKEN_LENGTH);
        await this.accountRepo.updateById(account.id, {
          $set: { 'credentials.refreshToken': refreshToken },
        });
        return {
          refreshToken,
          token: accessToken,
        };
      }
    }
    return throwStandardError(ErrorCode.FAILED_TO_REFRESH_TOKEN);
  }

  async updateCredentials(
    accountId: string,
    input: AccountUpdateCredentialsDto,
  ) {
    const account = await this.accountRepo.findByIdOrFail(accountId);
    const isValid = await this.bcryptService.compare(
      input.oldPassword,
      account.credentials.password,
    );
    if (isValid) {
      const hashedPassword = await this.bcryptService.hash(input.password);
      const refreshToken = generateRandomString(REFRESH_TOKEN_LENGTH);
      const updateData = {
        credentials: {
          passwordChangedAt: new Date(),
          password: hashedPassword,
          refreshToken,
        },
      };
      const updatedAcc = (await this.accountRepo.updateById(
        accountId,
        updateData,
      )) as AccountDocument;
      const newTokenData = {
        id: updatedAcc.id,
        identifier: updatedAcc.identifier,
        identifierType: updatedAcc.identifierType,
      };
      const accessToken = this.jwtService.signToken(newTokenData);
      const convertedAcc = convertObject(updatedAcc);
      return {
        ...convertedAcc,
        credentials: {
          ...convertedAcc.credentials,
          token: accessToken,
        },
      };
    }
    return throwStandardError(ErrorCode.INCORRECT_PASSWORD);
  }

  async teardown(userId: string) {
    await this.accountRepo.deleteById(userId);
  }

  async switchRole(userId: string, input: SwitchRoleInputDto) {
    return this.accountRepo.withTransaction(async (session) => {
      const account = await this.accountRepo.findByIdOrFail(userId, {
        session,
      });
      if (account.role !== input.role) {
        let roleRequestStatus: ERoleRequestStatus = ERoleRequestStatus.PENDING;
        if (input.role === IAccountRole.USER) {
          await this.accountRepo.updateById(
            userId,
            {
              role: input.role,
            },
            { session },
          );
          roleRequestStatus = ERoleRequestStatus.ACCEPTED;
        }
        await this.accountMetadataRepo.updateOneOrCreate(
          { userId },
          {
            userId,
            roleRequest: {
              reason: input.reason,
              role: input.role,
              requestedAt: Date.now(),
              status: roleRequestStatus,
            },
          },
          { session },
        );
        return {
          status: roleRequestStatus,
        };
      }
      return {
        status: ERoleRequestStatus.ACCEPTED,
      };
    });
  }

  private async isEligibleForCreateAccount(input: CreateAccountDto) {
    // not allow to create admin account
    if (input.namespace === IamNamespace.GEOTERRY_ADMINS) {
      throw new ForbiddenException({
        message: 'You are not allowed to register as an admin account',
        sentryAlertDisabled: true,
      });
    }

    // check duplicate account
    const duplicatedAcc = await this.accountRepo.findOne({
      namespace: input.namespace,
      identifier: input.identifier,
      identifierType: input.identifierType,
    });
    if (duplicatedAcc)
      throw new ForbiddenException({
        message: 'Account already exists',
        sentryAlertDisabled: true,
      });

    // check OTP code
    switch (input.identifierType) {
      case EIdentifierType.PHONE_NUMBER: {
        const res = await this.twilioService.verifyOTPCode(
          input.code,
          input.identifier,
        );
        if (res.status !== EVerificationStatus.APPROVED)
          return throwStandardError(ErrorCode.INCORRECT_OTP);
        break;
      }
      default:
        throw new BadRequestException({
          message: `Creating account through ${input.identifierType} channel is not supported yet!`,
          sentryAlertDisabled: true,
        });
    }
  }

  private async isAccountOTPCorrect(input: VerifyAccountRecoverOTPDto) {
    const acc = await this.accountRepo.findOneOrFail({
      namespace: input.namespace,
      identifier: input.identifier,
      identifierType: input.identifierType,
    });

    // check OTP code
    switch (input.identifierType) {
      case EIdentifierType.PHONE_NUMBER: {
        const res = await this.twilioService.verifyOTPCode(
          input.otp,
          input.identifier,
        );
        if (res.status !== EVerificationStatus.APPROVED)
          return throwStandardError(ErrorCode.INCORRECT_OTP);
        break;
      }
      default:
        throw new BadRequestException({
          message: `Recovering account through ${input.identifierType} channel is not supported yet!`,
          sentryAlertDisabled: true,
        });
    }

    return acc;
  }

  private async isEligibleForRecoveringAccount(input: RecoverAccountDto) {
    const acc = await this.accountRepo.findOneOrFail({
      namespace: input.namespace,
      identifier: input.identifier,
      identifierType: input.identifierType,
    });

    // check OTP code
    switch (input.identifierType) {
      case EIdentifierType.PHONE_NUMBER: {
        if (
          !acc.credentials?.recoveryCode ||
          acc.credentials.recoveryCode !== input.code
        )
          return throwStandardError(ErrorCode.INCORRECT_VERIFY_CODE);
        break;
      }
      default:
        throw new BadRequestException({
          message: `Recovering account through ${input.identifierType} channel is not supported yet!`,
          sentryAlertDisabled: true,
        });
    }

    return acc;
  }
}
