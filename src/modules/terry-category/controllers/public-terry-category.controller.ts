import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EndpointConfig } from 'src/decorators/endpoint-config.decorator';
import { I18nExceptionFilter } from 'src/filters/i18n-exception.filter';
import {
  TERRY_CATEGORY_ENDPOINT_CONFIG,
  ETerryCategoryOperation,
} from './endpoint-config';
import { FilterTerryCategoryInputDto } from '../dto/terry-category.dto';
import { PublicTerryCategoryService } from '../providers/public-terry-category.service';

@Controller('public/terry-category')
@ApiTags('public.terryCategory')
@UseFilters(I18nExceptionFilter)
export class PublicTerryCategoryController {
  constructor(
    private readonly publicTerryCategorySvc: PublicTerryCategoryService,
  ) {}

  @EndpointConfig(
    TERRY_CATEGORY_ENDPOINT_CONFIG[
      ETerryCategoryOperation.PUBLIC_FILTER_TERRY_CATEGORY
    ],
  )
  @Post('filter')
  async filter(@Body() data: FilterTerryCategoryInputDto) {
    return this.publicTerryCategorySvc.readCategories(data);
  }
}
