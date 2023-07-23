import {
  Body,
  Controller,
  Param,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthEndpoint } from 'src/decorators/auth-endpoint.decorator';
import { EndpointConfig } from 'src/decorators/endpoint-config.decorator';
import { I18nExceptionFilter } from 'src/filters/i18n-exception.filter';
import { AuthGuard } from 'src/guards/auth.guard';
import { IamNamespace } from 'src/shared/types';
import { TerryService } from '../providers/terry.service';
import { ProfileAccessGuard } from 'src/guards/store-access.guard';
import { ETerryOperation, TERRY_ENDPOINT_CONFIG } from './endpoint-config';
import { TerryInputDto } from '../dto/terry.dto';
import { TerryFilterInputDto } from '../dto/terry-filter.dto';

@Controller('profile/:profileId/terry')
@ApiTags('builder.terry')
@UseFilters(I18nExceptionFilter)
@UseGuards(AuthGuard, ProfileAccessGuard)
@ApiBearerAuth()
export class TerryController {
  constructor(private readonly terryService: TerryService) {}

  @EndpointConfig(TERRY_ENDPOINT_CONFIG[ETerryOperation.BUILDER_CREATE_TERRY])
  @AuthEndpoint({
    namespaces: [IamNamespace.GEOTERRY_ADMINS, IamNamespace.GEOTERRY_BUILDERS],
  })
  @Post()
  create(@Body() data: TerryInputDto, @Param('profileId') profileId: string) {
    return this.terryService.createTerry(data, profileId);
  }

  @EndpointConfig(TERRY_ENDPOINT_CONFIG[ETerryOperation.BUILDER_GET_TERRIES])
  @AuthEndpoint({
    namespaces: [IamNamespace.GEOTERRY_ADMINS, IamNamespace.GEOTERRY_BUILDERS],
  })
  @Post('filter')
  filter(
    @Body() data: TerryFilterInputDto,
    @Param('profileId') profileId: string,
  ) {
    return this.terryService.filterTerries(data, profileId);
  }
}
