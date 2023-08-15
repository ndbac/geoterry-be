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
import { TerryCheckinService } from '../providers/terry-checkin.service';
import {
  ETerryCheckinOperation,
  TERRY_CHECKIN_ENDPOINT_CONFIG,
} from './endpoint-config';
import { TerryCheckinInputDto } from '../dto/terry-checkin.dto';
import { ProfileAccessGuard } from 'src/guards/store-access.guard';

@Controller('hunter/:profileId/terry-checkin')
@ApiTags('hunter.terryCheckin')
@UseFilters(I18nExceptionFilter)
@UseGuards(AuthGuard, ProfileAccessGuard)
@ApiBearerAuth()
export class TerryCheckinController {
  constructor(private readonly terryCheckinSvc: TerryCheckinService) {}

  @EndpointConfig(
    TERRY_CHECKIN_ENDPOINT_CONFIG[ETerryCheckinOperation.HUNTER_CHECKIN_TERRY],
  )
  @AuthEndpoint({
    namespaces: [
      IamNamespace.GEOTERRY_ADMINS,
      IamNamespace.GEOTERRY_HUNTERS,
      IamNamespace.GEOTERRY_BUILDERS,
    ],
  })
  @Post()
  async checkin(
    @Body() data: TerryCheckinInputDto,
    @Param('profileId') profileId: string,
  ) {
    return this.terryCheckinSvc.checkin(data, profileId);
  }
}
