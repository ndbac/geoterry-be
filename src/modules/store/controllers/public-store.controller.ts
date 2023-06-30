import { Controller, Get, Param, Query, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EndpointConfig } from 'src/decorators/endpoint-config.decorator';
import { I18nExceptionFilter } from 'src/filters/i18n-exception.filter';
import { PublicStoreService } from '../providers/public-store.service';
import { ACCOUNT_ENDPOINT_CONFIG, EAccountOperation } from './endpoint-config';
import { PublicReadStoreQueryDto } from '../dto/store.dto';

@Controller('public/store')
@ApiTags('public.store')
@UseFilters(I18nExceptionFilter)
export class PublicStoreController {
  constructor(private readonly publicStoreSvc: PublicStoreService) {}

  @EndpointConfig(ACCOUNT_ENDPOINT_CONFIG[EAccountOperation.PUBLIC_READ_STORE])
  @Get(':slug')
  async readStore(
    @Param('slug') slug: string,
    @Query() query: PublicReadStoreQueryDto,
  ) {
    return this.publicStoreSvc.readStore(slug, query);
  }
}
