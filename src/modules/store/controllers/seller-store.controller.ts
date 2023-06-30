import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { EndpointConfig } from 'src/decorators/endpoint-config.decorator';
import { ExtractCreateStoreInput } from 'src/decorators/store-input.decorator';
import { I18nExceptionFilter } from 'src/filters/i18n-exception.filter';
import { AuthGuard } from 'src/guards/auth.guard';
import { SellerCreateStoreInputWithUserContextDto } from '../dto/create-store.dto';
import { SellerStoreService } from '../providers/seller-store.service';
import { ACCOUNT_ENDPOINT_CONFIG, EAccountOperation } from './endpoint-config';
import { User } from 'src/decorators/user.decorator';
import { UpdateStoreReqDto } from '../dto/update-store.dto';
import { GeneralActionStatus, IamNamespace } from 'src/shared/types';
import { AuthEndpoint } from 'src/decorators/auth-endpoint.decorator';
import { throwStandardError } from 'src/errors/helpers';
import { ErrorCode } from 'src/errors/error-defs';
import { UploadPhotoInterceptor } from 'src/interceptors/upload-photo.interceptor';

@Controller('store')
@ApiTags('seller.store')
@UseGuards(AuthGuard)
@UseFilters(I18nExceptionFilter)
@ApiBearerAuth()
export class SellerStoreController {
  constructor(private readonly sellerStoreSvc: SellerStoreService) {}

  @EndpointConfig(
    ACCOUNT_ENDPOINT_CONFIG[EAccountOperation.SELLER_CREATE_STORE],
  )
  @AuthEndpoint({
    namespaces: [IamNamespace.GEOTERRY_ADMINS, IamNamespace.GEOTERRY_BUILDERS],
  })
  @Post()
  async createStore(
    @ExtractCreateStoreInput()
    { data }: SellerCreateStoreInputWithUserContextDto,
  ) {
    return this.sellerStoreSvc.onboardStore(data);
  }

  @EndpointConfig(ACCOUNT_ENDPOINT_CONFIG[EAccountOperation.SELLER_READ_STORE])
  @AuthEndpoint({
    namespaces: [IamNamespace.GEOTERRY_ADMINS, IamNamespace.GEOTERRY_BUILDERS],
  })
  @Get()
  async readStore(@User('userId') userId: string) {
    return this.sellerStoreSvc.readStore(userId);
  }

  @EndpointConfig(
    ACCOUNT_ENDPOINT_CONFIG[EAccountOperation.SELLER_UPDATE_STORE],
  )
  @AuthEndpoint({
    namespaces: [IamNamespace.GEOTERRY_ADMINS, IamNamespace.GEOTERRY_BUILDERS],
  })
  @Put()
  async updateStore(
    @User('userId') userId: string,
    @Body() input: UpdateStoreReqDto,
  ) {
    return this.sellerStoreSvc.updateStore(userId, input);
  }

  @EndpointConfig(
    ACCOUNT_ENDPOINT_CONFIG[EAccountOperation.SELLER_UPLOAD_PHOTO],
  )
  @AuthEndpoint({
    namespaces: [IamNamespace.GEOTERRY_ADMINS, IamNamespace.GEOTERRY_BUILDERS],
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(UploadPhotoInterceptor)
  @Post('photo')
  uploadPhoto(@UploadedFile() file: { path?: string; error?: any }) {
    if (file.error) {
      throwStandardError(ErrorCode.UPLOAD_FILE_FAILED, file.error);
      return;
    }
    return {
      status: GeneralActionStatus.SUCCEEDED,
      photoUrl: file.path,
    };
  }
}
