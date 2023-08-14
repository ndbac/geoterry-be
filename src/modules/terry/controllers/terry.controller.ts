import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthEndpoint } from 'src/decorators/auth-endpoint.decorator';
import { EndpointConfig } from 'src/decorators/endpoint-config.decorator';
import { I18nExceptionFilter } from 'src/filters/i18n-exception.filter';
import { AuthGuard } from 'src/guards/auth.guard';
import { IPagination, IamNamespace } from 'src/shared/types';
import { TerryService } from '../providers/terry.service';
import { ProfileAccessGuard } from 'src/guards/store-access.guard';
import { ETerryOperation, TERRY_ENDPOINT_CONFIG } from './endpoint-config';
import { TerryInputDto } from '../dto/terry.dto';
import { TerryFilterInputDto } from '../dto/terry-filter.dto';
import { NormalizedGeoJsonPointInterceptor } from 'src/interceptors/terry/normalized-geo-json-point.interceptor';
import { PaginationInterceptor } from 'src/interceptors/pagination.interceptor';
import {
  Pagination,
  PaginationSwaggerQuery,
} from 'src/decorators/pagination.decorator';
import { InjectCategoriesToTerryInterceptor } from 'src/interceptors/terry/inject-categories-to-terry.interceptor';
import { InjectProfileToTerryInterceptor } from 'src/interceptors/terry/inject-profile-to-terry.interceptor';

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
  @UseInterceptors(NormalizedGeoJsonPointInterceptor)
  @Post()
  create(@Body() data: TerryInputDto, @Param('profileId') profileId: string) {
    return this.terryService.createTerry(data, profileId);
  }

  @EndpointConfig(TERRY_ENDPOINT_CONFIG[ETerryOperation.BUILDER_UPDATE_TERRY])
  @AuthEndpoint({
    namespaces: [IamNamespace.GEOTERRY_ADMINS, IamNamespace.GEOTERRY_BUILDERS],
  })
  @UseInterceptors(NormalizedGeoJsonPointInterceptor)
  @Put(':id')
  update(@Body() data: TerryInputDto, @Param('id') terryId: string) {
    return this.terryService.updateTerry(data, terryId);
  }

  @EndpointConfig(TERRY_ENDPOINT_CONFIG[ETerryOperation.BUILDER_DELETE_TERRY])
  @AuthEndpoint({
    namespaces: [IamNamespace.GEOTERRY_ADMINS, IamNamespace.GEOTERRY_BUILDERS],
  })
  @UseInterceptors(NormalizedGeoJsonPointInterceptor)
  @Delete(':id')
  delete(@Param('id') terryId: string, @Param('profileId') profileId: string) {
    return this.terryService.deleteTerry(terryId, profileId);
  }

  @EndpointConfig(TERRY_ENDPOINT_CONFIG[ETerryOperation.BUILDER_GET_TERRIES])
  @AuthEndpoint({
    namespaces: [IamNamespace.GEOTERRY_ADMINS, IamNamespace.GEOTERRY_BUILDERS],
  })
  @UseInterceptors(
    InjectProfileToTerryInterceptor,
    InjectCategoriesToTerryInterceptor,
    NormalizedGeoJsonPointInterceptor,
    PaginationInterceptor,
  )
  @PaginationSwaggerQuery()
  @Post('filter')
  filter(
    @Body() data: TerryFilterInputDto,
    @Param('profileId') profileId: string,
    @Pagination() pagination: IPagination,
  ) {
    return this.terryService.filterTerries(data, profileId, pagination);
  }

  @EndpointConfig(TERRY_ENDPOINT_CONFIG[ETerryOperation.BUILDER_GET_TERRY])
  @AuthEndpoint({
    namespaces: [IamNamespace.GEOTERRY_ADMINS, IamNamespace.GEOTERRY_BUILDERS],
  })
  @UseInterceptors(
    InjectProfileToTerryInterceptor,
    InjectCategoriesToTerryInterceptor,
    NormalizedGeoJsonPointInterceptor,
  )
  @Get(':id')
  getTerry(
    @Param('id') terryId: string,
    @Param('profileId') profileId: string,
  ) {
    return this.terryService.getTerryById(terryId, profileId);
  }
}
