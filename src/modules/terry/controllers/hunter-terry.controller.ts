import {
  Body,
  Controller,
  Get,
  Param,
  Post,
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
import { ProfileAccessGuard } from 'src/guards/store-access.guard';
import { ETerryOperation, TERRY_ENDPOINT_CONFIG } from './endpoint-config';
import { TerryFilterInputDto } from '../dto/terry-filter.dto';
import { NormalizedGeoJsonPointInterceptor } from 'src/interceptors/terry/normalized-geo-json-point.interceptor';
import { PaginationInterceptor } from 'src/interceptors/pagination.interceptor';
import {
  Pagination,
  PaginationSwaggerQuery,
} from 'src/decorators/pagination.decorator';
import { InjectCategoriesToTerryInterceptor } from 'src/interceptors/terry/inject-categories-to-terry.interceptor';
import { InjectProfileToTerryInterceptor } from 'src/interceptors/terry/inject-profile-to-terry.interceptor';
import { InjectRatingToTerryInterceptor } from 'src/interceptors/terry/inject-rating-to-terry.interceptor';
import { FilterTerriesByRatingInterceptor } from 'src/interceptors/terry/filter-terries-by-rating.interceptor';
import { InjectTerryUserCustomDataInterceptor } from 'src/interceptors/terry/inject-terry-user-custom-data-to-terry.interceptor';
import { HunterTerryService } from '../providers/hunter-terry.service';

@Controller('hunter/:profileId/terry')
@ApiTags('hunter.terry')
@UseFilters(I18nExceptionFilter)
@UseGuards(AuthGuard, ProfileAccessGuard)
@ApiBearerAuth()
export class HunterTerryController {
  constructor(private readonly hunterTerryService: HunterTerryService) {}

  @EndpointConfig(TERRY_ENDPOINT_CONFIG[ETerryOperation.HUNTER_GET_TERRIES])
  @AuthEndpoint({
    namespaces: [
      IamNamespace.GEOTERRY_ADMINS,
      IamNamespace.GEOTERRY_BUILDERS,
      IamNamespace.GEOTERRY_HUNTERS,
    ],
  })
  @UseInterceptors(
    InjectProfileToTerryInterceptor,
    InjectCategoriesToTerryInterceptor,
    InjectTerryUserCustomDataInterceptor,
    FilterTerriesByRatingInterceptor,
    InjectRatingToTerryInterceptor,
    NormalizedGeoJsonPointInterceptor,
    PaginationInterceptor,
  )
  @PaginationSwaggerQuery()
  @Post('filter')
  filter(
    @Body() data: TerryFilterInputDto,
    @Pagination() pagination: IPagination,
  ) {
    return this.hunterTerryService.filterTerries(data, pagination);
  }

  @EndpointConfig(TERRY_ENDPOINT_CONFIG[ETerryOperation.HUNTER_GET_TERRY])
  @AuthEndpoint({
    namespaces: [
      IamNamespace.GEOTERRY_ADMINS,
      IamNamespace.GEOTERRY_BUILDERS,
      IamNamespace.GEOTERRY_HUNTERS,
    ],
  })
  @UseInterceptors(
    InjectProfileToTerryInterceptor,
    InjectTerryUserCustomDataInterceptor,
    InjectRatingToTerryInterceptor,
    InjectCategoriesToTerryInterceptor,
    NormalizedGeoJsonPointInterceptor,
  )
  @Get(':id')
  getTerry(@Param('id') terryId: string) {
    return this.hunterTerryService.getTerryById(terryId);
  }
}
