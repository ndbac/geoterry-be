import {
  Body,
  Controller,
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
import { TerryUserMappingService } from '../providers/terry-user-mapping.service';
import {
  ETerryUserMappingOperation,
  TERRY_USER_MAPPING_ENDPOINT_CONFIG,
} from './endpoint-config';
import { ProfileAccessGuard } from 'src/guards/profile-access.guard';
import { UpsertTerryUserMappingInputDto } from '../dto/terry-user-mapping.dto';

@Controller('hunter/:profileId/terry/:terryId/terry-user-mapping')
@ApiTags('hunter.terryUserMapping')
@UseFilters(I18nExceptionFilter)
@UseGuards(AuthGuard, ProfileAccessGuard)
@ApiBearerAuth()
export class TerryUserMappingController {
  constructor(private readonly terryUserMappingSvc: TerryUserMappingService) {}

  @EndpointConfig(
    TERRY_USER_MAPPING_ENDPOINT_CONFIG[
      ETerryUserMappingOperation.HUNTER_UPSERT_TERRY_USER_MAPPING
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
    @Body() data: UpsertTerryUserMappingInputDto,
    @Param('profileId') profileId: string,
    @Param('terryId') terryId: string,
  ) {
    return this.terryUserMappingSvc.upsert(data, profileId, terryId);
  }
}
