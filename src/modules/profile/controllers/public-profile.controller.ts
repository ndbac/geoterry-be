import { Controller, Get, Param, Query, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EndpointConfig } from 'src/decorators/endpoint-config.decorator';
import { I18nExceptionFilter } from 'src/filters/i18n-exception.filter';
import { PublicProfileService } from '../providers/public-profile.service';
import { ACCOUNT_ENDPOINT_CONFIG, EAccountOperation } from './endpoint-config';
import { PublicReadProfileQueryDto } from '../dto/profile.dto';

@Controller('public/profile')
@ApiTags('public.profile')
@UseFilters(I18nExceptionFilter)
export class PublicProfileController {
  constructor(private readonly publicProfileSvc: PublicProfileService) {}

  @EndpointConfig(
    ACCOUNT_ENDPOINT_CONFIG[EAccountOperation.PUBLIC_READ_PROFILE],
  )
  @Get(':slug')
  async readProfile(
    @Param('slug') slug: string,
    @Query() query: PublicReadProfileQueryDto,
  ) {
    return this.publicProfileSvc.readProfile(slug, query);
  }
}
