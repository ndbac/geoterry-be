import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { EndpointConfig } from 'src/decorators/endpoint-config.decorator';
import { ExtractCreateProfileInput } from 'src/decorators/profile-input.decorator';
import { I18nExceptionFilter } from 'src/filters/i18n-exception.filter';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserCreateProfileInputWithUserContextDto } from '../dto/create-profile.dto';
import { UserProfileService } from '../providers/user-profile.service';
import { ACCOUNT_ENDPOINT_CONFIG, EAccountOperation } from './endpoint-config';
import { User } from 'src/decorators/user.decorator';
import {
  UpdateProfileLocationReqDto,
  UpdateProfileReqDto,
} from '../dto/update-profile.dto';
import { GeneralActionStatus, IamNamespace } from 'src/shared/types';
import { AuthEndpoint } from 'src/decorators/auth-endpoint.decorator';
import { throwStandardError } from 'src/errors/helpers';
import { ErrorCode } from 'src/errors/error-defs';
import { UploadPhotoInterceptor } from 'src/interceptors/upload-photo.interceptor';
import { NormalizedGeoJsonPointForProfileInterceptor } from 'src/interceptors/profile/normalized-geo-json-point-for-profile.interceptor';
import { UserGetProfileNearbyReqDto } from '../dto/profile.dto';

@Controller('profile')
@ApiTags('user.profile')
@UseGuards(AuthGuard)
@UseFilters(I18nExceptionFilter)
@ApiBearerAuth()
export class UserProfileController {
  constructor(private readonly userProfileSvc: UserProfileService) {}

  @EndpointConfig(
    ACCOUNT_ENDPOINT_CONFIG[EAccountOperation.USER_CREATE_PROFILE],
  )
  @AuthEndpoint({
    namespaces: [
      IamNamespace.GEOTERRY_ADMINS,
      IamNamespace.GEOTERRY_BUILDERS,
      IamNamespace.GEOTERRY_HUNTERS,
    ],
  })
  @Post()
  async createProfile(
    @ExtractCreateProfileInput()
    { data }: UserCreateProfileInputWithUserContextDto,
  ) {
    return this.userProfileSvc.onboardProfile(data);
  }

  @EndpointConfig(ACCOUNT_ENDPOINT_CONFIG[EAccountOperation.USER_READ_PROFILE])
  @AuthEndpoint({
    namespaces: [
      IamNamespace.GEOTERRY_ADMINS,
      IamNamespace.GEOTERRY_BUILDERS,
      IamNamespace.GEOTERRY_HUNTERS,
    ],
  })
  @Get()
  async readProfile(@User('userId') userId: string) {
    return this.userProfileSvc.readProfile(userId);
  }

  @EndpointConfig(
    ACCOUNT_ENDPOINT_CONFIG[EAccountOperation.USER_UPDATE_PROFILE],
  )
  @AuthEndpoint({
    namespaces: [
      IamNamespace.GEOTERRY_ADMINS,
      IamNamespace.GEOTERRY_BUILDERS,
      IamNamespace.GEOTERRY_HUNTERS,
    ],
  })
  @Put()
  async updateProfile(
    @User('userId') userId: string,
    @Body() input: UpdateProfileReqDto,
  ) {
    return this.userProfileSvc.updateProfile(userId, input);
  }

  @EndpointConfig(ACCOUNT_ENDPOINT_CONFIG[EAccountOperation.USER_UPLOAD_PHOTO])
  @AuthEndpoint({
    namespaces: [
      IamNamespace.GEOTERRY_ADMINS,
      IamNamespace.GEOTERRY_BUILDERS,
      IamNamespace.GEOTERRY_HUNTERS,
    ],
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

  @EndpointConfig(
    ACCOUNT_ENDPOINT_CONFIG[EAccountOperation.USER_UPDATE_PROFILE_LOCATION],
  )
  @AuthEndpoint({
    namespaces: [
      IamNamespace.GEOTERRY_ADMINS,
      IamNamespace.GEOTERRY_BUILDERS,
      IamNamespace.GEOTERRY_HUNTERS,
    ],
  })
  @UseInterceptors(NormalizedGeoJsonPointForProfileInterceptor)
  @Put('location')
  async updateProfileLocation(
    @User('userId') userId: string,
    @Body() input: UpdateProfileLocationReqDto,
  ) {
    return this.userProfileSvc.updateProfileLocation(userId, input);
  }

  @EndpointConfig(
    ACCOUNT_ENDPOINT_CONFIG[EAccountOperation.USER_GET_PROFILE_NEARBY],
  )
  @AuthEndpoint({
    namespaces: [
      IamNamespace.GEOTERRY_ADMINS,
      IamNamespace.GEOTERRY_BUILDERS,
      IamNamespace.GEOTERRY_HUNTERS,
    ],
  })
  @Post('profile-nearby')
  async getProfileNearby(
    @User('userId') userId: string,
    @Body() input: UserGetProfileNearbyReqDto,
  ) {
    return this.userProfileSvc.getProfileNearby(userId, input);
  }

  @EndpointConfig(
    ACCOUNT_ENDPOINT_CONFIG[EAccountOperation.USER_READ_OTHER_PROFILE],
  )
  @AuthEndpoint({
    namespaces: [
      IamNamespace.GEOTERRY_ADMINS,
      IamNamespace.GEOTERRY_BUILDERS,
      IamNamespace.GEOTERRY_HUNTERS,
    ],
  })
  @Get('other/:profileId')
  async readOtherProfile(
    @User('userId') userId: string,
    @Param('profileId') profileId: string,
  ) {
    return this.userProfileSvc.readOtherProfile(userId, profileId);
  }
}
