import {
  Body,
  Controller,
  Post,
  Put,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EndpointConfig } from 'src/decorators/endpoint-config.decorator';
import { I18nExceptionFilter } from 'src/filters/i18n-exception.filter';
import {
  CreateAccountDto,
  SendVerificationDto,
} from '../dto/create-account.dto';
import { ACCOUNT_ENDPOINT_CONFIG, EAccountOperation } from './endpoint-config';
import { AccountService } from '../providers/account.service';
import { MaskCredentialsInAccountInterceptor } from 'src/interceptors/mask-cred-in-account.interceptor';
import {
  AccountLoginInputDto,
  AccountRefreshToken,
  AccountUpdateCredentialsDto,
} from '../dto/account-login.dto';
import {
  RecoverAccountDto,
  VerifyAccountRecoverOTPDto,
} from '../dto/account-recover.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/decorators/user.decorator';

@Controller('auth')
@ApiTags('auth')
@UseFilters(I18nExceptionFilter)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @EndpointConfig(ACCOUNT_ENDPOINT_CONFIG[EAccountOperation.CREATE_ACCOUNT])
  @UseInterceptors(MaskCredentialsInAccountInterceptor)
  @Post('/otp/register')
  async create(@Body() data: CreateAccountDto) {
    return this.accountService.createAccount(data);
  }

  @EndpointConfig(ACCOUNT_ENDPOINT_CONFIG[EAccountOperation.ACCOUNT_RECOVER])
  @UseInterceptors(MaskCredentialsInAccountInterceptor)
  @Put('/otp/recover')
  async recover(@Body() data: RecoverAccountDto) {
    return this.accountService.recoverAccount(data);
  }

  @EndpointConfig(
    ACCOUNT_ENDPOINT_CONFIG[EAccountOperation.SEND_ACCOUNT_VERIFY_CODE],
  )
  @Post('/otp/send')
  async sendVerification(@Body() data: SendVerificationDto) {
    return this.accountService.sendVerification(data);
  }

  @EndpointConfig(
    ACCOUNT_ENDPOINT_CONFIG[EAccountOperation.VERIFY_ACCOUNT_RECOVERY_OTP],
  )
  @Put('/otp/verify')
  async verifyRecoveryOTP(@Body() data: VerifyAccountRecoverOTPDto) {
    return this.accountService.verifyAccountRecoveryOtp(data);
  }

  @EndpointConfig(ACCOUNT_ENDPOINT_CONFIG[EAccountOperation.ACCOUNT_LOGIN])
  @UseInterceptors(MaskCredentialsInAccountInterceptor)
  @Post('/login')
  async loginAccount(@Body() data: AccountLoginInputDto) {
    return this.accountService.login(data);
  }

  @EndpointConfig(
    ACCOUNT_ENDPOINT_CONFIG[EAccountOperation.ACCOUNT_UPDATE_CREDENTIALS],
  )
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Put('/update-credentials')
  async updateCredentials(
    @Body() data: AccountUpdateCredentialsDto,
    @User('userId') userId: string,
  ) {
    return this.accountService.updateCredentials(userId, data);
  }

  @EndpointConfig(ACCOUNT_ENDPOINT_CONFIG[EAccountOperation.REFRESH_TOKEN])
  @UseInterceptors(MaskCredentialsInAccountInterceptor)
  @Put('/refresh')
  async refreshToken(@Body() data: AccountRefreshToken) {
    return this.accountService.refreshToken(data);
  }
}
