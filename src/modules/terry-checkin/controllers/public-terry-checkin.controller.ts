import {
  Controller,
  Get,
  Param,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EndpointConfig } from 'src/decorators/endpoint-config.decorator';
import { I18nExceptionFilter } from 'src/filters/i18n-exception.filter';
import { IPagination } from 'src/shared/types';
import {
  ETerryCheckinOperation,
  TERRY_CHECKIN_ENDPOINT_CONFIG,
} from './endpoint-config';
import {
  Pagination,
  PaginationSwaggerQuery,
} from 'src/decorators/pagination.decorator';
import { PaginationInterceptor } from 'src/interceptors/pagination.interceptor';
import { PublicTerryCheckinService } from '../providers/public-terry-checkin.service';

@Controller('public/terry-checkin')
@ApiTags('public.terryCheckin')
@UseFilters(I18nExceptionFilter)
@ApiBearerAuth()
export class PublicTerryCheckinController {
  constructor(
    private readonly publicTerryCheckinSvc: PublicTerryCheckinService,
  ) {}

  @EndpointConfig(
    TERRY_CHECKIN_ENDPOINT_CONFIG[
      ETerryCheckinOperation.PUBLIC_GET_CHECKINS_OF_TERRY
    ],
  )
  @UseInterceptors(PaginationInterceptor)
  @PaginationSwaggerQuery()
  @Get(':terryId')
  async filter(
    @Param('terryId') terryId: string,
    @Pagination() pagination: IPagination,
  ) {
    return this.publicTerryCheckinSvc.getCheckinsOfTerry(terryId, pagination);
  }
}