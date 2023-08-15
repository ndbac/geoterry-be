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
import { TerryReportService } from '../providers/terry-report.service';
import {
  ETerryReportOperation,
  TERRY_REPORT_ENDPOINT_CONFIG,
} from './endpoint-config';
import { TerryReportInputDto } from '../dto/terry-report.dto';
import { ProfileAccessGuard } from 'src/guards/store-access.guard';

@Controller('hunter/:profileId/terry-report')
@ApiTags('hunter.terryReport')
@UseFilters(I18nExceptionFilter)
@UseGuards(AuthGuard, ProfileAccessGuard)
@ApiBearerAuth()
export class TerryReportController {
  constructor(private readonly terryReportSvc: TerryReportService) {}

  @EndpointConfig(
    TERRY_REPORT_ENDPOINT_CONFIG[ETerryReportOperation.HUNTER_REPORT_TERRY],
  )
  @AuthEndpoint({
    namespaces: [
      IamNamespace.GEOTERRY_ADMINS,
      IamNamespace.GEOTERRY_HUNTERS,
      IamNamespace.GEOTERRY_BUILDERS,
    ],
  })
  @Post()
  async create(
    @Body() data: TerryReportInputDto,
    @Param('profileId') profileId: string,
  ) {
    return this.terryReportSvc.report(data, profileId);
  }
}
