import { Controller, Get, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EndpointConfig } from 'src/decorators/endpoint-config.decorator';
import { I18nExceptionFilter } from 'src/filters/i18n-exception.filter';
import { AppGlobalService } from '../providers/app-global.service';
import { CommonErrorResponses } from 'src/decorators/common-error-responses';
import {
  APP_GLOBAL_ENDPOINT_CONFIG,
  EAppGlobalOperationId,
} from './endpoint-config';

@Controller('/app-global')
@ApiTags('public.app-global')
@UseFilters(I18nExceptionFilter)
export class AppGlobalController {
  constructor(private readonly appGlobalSvc: AppGlobalService) {}

  @Get('public-version-configuration')
  @EndpointConfig(
    APP_GLOBAL_ENDPOINT_CONFIG[EAppGlobalOperationId.GET_VERSION_CONFIGURATION],
  )
  @CommonErrorResponses()
  getVersionConfiguration() {
    return this.appGlobalSvc.getVersionConfiguration();
  }

  @Get('public-feature-flags')
  @EndpointConfig(
    APP_GLOBAL_ENDPOINT_CONFIG[EAppGlobalOperationId.GET_FEATURE_FLAGS],
  )
  @CommonErrorResponses()
  getFeatureFlags() {
    return this.appGlobalSvc.getFeatureFlags();
  }
}
