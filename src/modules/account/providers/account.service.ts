import { throwStandardError } from './../../../errors/helpers';
import { IamNamespace } from './../../../shared/types';
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
} from '../dto/account-login.dto';
import config from 'config';
import { convertObject } from 'src/shared/mongoose/helpers';
import { JwtPayload } from 'jsonwebtoken';
import { isAfter } from 'date-fns';
import { ErrorCode } from 'src/errors/error-defs';
import { RecoverAccountDto } from '../dto/account-recover.dto';

@Injectable()
export class AccountService {
  constructor(
    private readonly accountRepo: AccountRepository,
    private readonly twilioService: TwilioService,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
  ) {}

  async sendVerification(input: SendVerificationDto) {
    const account = await this.accountRepo.findOne({
      identifierType: input.identifierType,
      identifier: input.identifier,
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
      return throwStandardError(ErrorCode.ALREADY_ONBOARD_IDENTIFIER);
    }
  }

  async createAccount(input: CreateAccountDto) {
    // check eligible for creating account
    await this.isEligibleForCreateAccount(input);

    const hashedPassword = await this.bcryptService.hash(input.password);
    const accountData = {
      credentials: {
        passwordChangedAt: new Date(),
        password: hashedPassword,
      },
      namespace: input.namespace,
      identifier: input.identifier,
      identifierType: input.identifierType,
    };
    return this.accountRepo.create(accountData);
  }

  async recoverAccount(input: RecoverAccountDto) {
    // check eligible for creating account
    await this.isEligibleForRecoveringAccount(input);

    const hashedPassword = await this.bcryptService.hash(input.password);
    const updateData = {
      credentials: {
        passwordChangedAt: new Date(),
        password: hashedPassword,
      },
    };
    return this.accountRepo.updateOne(
      {
        namespace: input.namespace,
        identifier: input.identifier,
        identifierType: input.identifierType,
      },
      updateData,
    );
  }

  async login(input: AccountLoginInputDto) {
    const account = await this.accountRepo.findOneOrFail({
      identifier: input.identifier,
      identifierType: input.identifierType,
    });
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
      return {
        ...convertObject(account),
        token: {
          accessToken,
          expiresIn: new Date(
            Date.now() + config.get<string>('jsonwebtoken.expiresIn'),
          ),
        },
      };
    }
    return throwStandardError(ErrorCode.INCORRECT_PASSWORD);
  }

  async refreshToken(input: AccountRefreshToken) {
    const tokenData = this.jwtService.verifyToken(input.token) as JwtPayload;
    if (tokenData?.data) {
      const account = await this.accountRepo.findByIdOrFail(tokenData.data?.id);
      if (
        isAfter(
          (tokenData.iat || 0) * 1000,
          account.credentials.passwordChangedAt,
        )
      ) {
        const newTokenData = {
          id: account.id,
          identifier: account.identifier,
          identifierType: account.identifierType,
        };
        const accessToken = this.jwtService.signToken(newTokenData);
        return {
          ...convertObject(account),
          token: {
            accessToken,
            expiresIn: new Date(
              Date.now() + config.get<string>('jsonwebtoken.expiresIn'),
            ),
          },
        };
      }
    }
    return throwStandardError(ErrorCode.FAILED_TO_REFRESH_TOKEN);
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

  private async isEligibleForRecoveringAccount(input: RecoverAccountDto) {
    // check duplicate account
    await this.accountRepo.findOneOrFail({
      namespace: input.namespace,
      identifier: input.identifier,
      identifierType: input.identifierType,
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
          message: `Recovering account through ${input.identifierType} channel is not supported yet!`,
          sentryAlertDisabled: true,
        });
    }
  }
}
