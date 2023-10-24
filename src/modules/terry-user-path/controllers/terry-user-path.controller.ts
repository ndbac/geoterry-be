import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthEndpoint } from 'src/decorators/auth-endpoint.decorator';
import { EndpointConfig } from 'src/decorators/endpoint-config.decorator';
import { I18nExceptionFilter } from 'src/filters/i18n-exception.filter';
import { AuthGuard } from 'src/guards/auth.guard';
import { IamNamespace } from 'src/shared/types';
import { TerryUserPathService } from '../providers/terry-user-path.service';
import {
  ETerryUserPathOperation,
  TERRY_USER_PATH_ENDPOINT_CONFIG,
} from './endpoint-config';
import { ProfileAccessGuard } from 'src/guards/store-access.guard';
import { TerryUserPathInputDto } from '../dto/terry-user-path.dto';

@Controller('hunter/:profileId/terry/:terryId/terry-user-path')
@ApiTags('hunter.terryUserPath')
@UseFilters(I18nExceptionFilter)
@UseGuards(AuthGuard, ProfileAccessGuard)
@ApiBearerAuth()
export class TerryUserPathController {
  constructor(private readonly terryUserPathSvc: TerryUserPathService) {}

  @EndpointConfig(
    TERRY_USER_PATH_ENDPOINT_CONFIG[
      ETerryUserPathOperation.HUNTER_GET_TERRY_USER_PATH
    ],
  )
  @AuthEndpoint({
    namespaces: [
      IamNamespace.GEOTERRY_ADMINS,
      IamNamespace.GEOTERRY_HUNTERS,
      IamNamespace.GEOTERRY_BUILDERS,
    ],
  })
  @Get()
  async get(
    @Param('profileId') profileId: string,
    @Param('terryId') terryId: string,
  ) {
    return this.terryUserPathSvc.get(profileId, terryId);
  }

  @EndpointConfig(
    TERRY_USER_PATH_ENDPOINT_CONFIG[
      ETerryUserPathOperation.HUNTER_UPSERT_TERRY_USER_PATH
    ],
  )
  @AuthEndpoint({
    namespaces: [
      IamNamespace.GEOTERRY_ADMINS,
      IamNamespace.GEOTERRY_HUNTERS,
      IamNamespace.GEOTERRY_BUILDERS,
    ],
  })
  @Put()
  async upsert(
    @Body() data: TerryUserPathInputDto,
    @Param('profileId') profileId: string,
    @Param('terryId') terryId: string,
  ) {
    return this.terryUserPathSvc.upsert(data, profileId, terryId);
  }
}
