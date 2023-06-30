import {
  Body,
  Controller,
  Post,
  Put,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EndpointConfig } from 'src/decorators/endpoint-config.decorator';
import { I18nExceptionFilter } from 'src/filters/i18n-exception.filter';
import {
  CreateAccountDto,
  SendVerificationDto,
} from '../dto/create-account.dto';
import { ACCOUNT_ENDPOINT_CONFIG, EAccountOperation } from './endpoint-config';
import { AccountService } from '../providers/account.service';
import { MaskCredentialsInAccountInterceptor } from 'src/interceptors/mask-cred-in-account';
import {
  AccountLoginInputDto,
  AccountRefreshToken,
} from '../dto/account-login.dto';
import { RecoverAccountDto } from '../dto/account-recover.dto';

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

  @EndpointConfig(ACCOUNT_ENDPOINT_CONFIG[EAccountOperation.ACCOUNT_LOGIN])
  @UseInterceptors(MaskCredentialsInAccountInterceptor)
  @Post('/login')
  async loginAccount(@Body() data: AccountLoginInputDto) {
    return this.accountService.login(data);
  }

  @EndpointConfig(ACCOUNT_ENDPOINT_CONFIG[EAccountOperation.REFRESH_TOKEN])
  @UseInterceptors(MaskCredentialsInAccountInterceptor)
  @Put('/refresh')
  async refreshToken(@Body() data: AccountRefreshToken) {
    return this.accountService.refreshToken(data);
  }
}
