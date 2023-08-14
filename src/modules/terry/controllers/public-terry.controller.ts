import {
  Body,
  Controller,
  Post,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EndpointConfig } from 'src/decorators/endpoint-config.decorator';
import { I18nExceptionFilter } from 'src/filters/i18n-exception.filter';
import { IPagination } from 'src/shared/types';
import { ETerryOperation, TERRY_ENDPOINT_CONFIG } from './endpoint-config';
import { TerryFilterInputDto } from '../dto/terry-filter.dto';
import { NormalizedGeoJsonPointInterceptor } from 'src/interceptors/terry/normalized-geo-json-point.interceptor';
import { PaginationInterceptor } from 'src/interceptors/pagination.interceptor';
import {
  Pagination,
  PaginationSwaggerQuery,
} from 'src/decorators/pagination.decorator';
import { PublicTerryService } from '../providers/public-terry.service';
import { InjectCategoriesToTerryInterceptor } from 'src/interceptors/terry/inject-categories-to-terry.interceptor';

@Controller('public/terry')
@ApiTags('public.terry')
@UseFilters(I18nExceptionFilter)
export class PublicTerryController {
  constructor(private readonly terryService: PublicTerryService) {}

  @EndpointConfig(TERRY_ENDPOINT_CONFIG[ETerryOperation.PUBLIC_GET_TERRIES])
  @UseInterceptors(
    InjectCategoriesToTerryInterceptor,
    NormalizedGeoJsonPointInterceptor,
    PaginationInterceptor,
  )
  @PaginationSwaggerQuery()
  @Post('filter')
  filter(
    @Body() data: TerryFilterInputDto,
    @Pagination() pagination: IPagination,
  ) {
    return this.terryService.filterTerries(data, pagination);
  }
}
