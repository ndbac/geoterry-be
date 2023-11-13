import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
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
import { TerryCheckinService } from '../providers/terry-checkin.service';
import {
  ETerryCheckinOperation,
  TERRY_CHECKIN_ENDPOINT_CONFIG,
} from './endpoint-config';
import {
  TerryCheckinInputDto,
  UpdateTerryCheckinInputDto,
} from '../dto/terry-checkin.dto';
import { ProfileAccessGuard } from 'src/guards/store-access.guard';
import {
  FilterTerryCheckinDto,
  ReadTerryCheckinQueryDto,
} from '../dto/terry-filter.dto';
import {
  Pagination,
  PaginationSwaggerQuery,
} from 'src/decorators/pagination.decorator';
import { PaginationInterceptor } from 'src/interceptors/pagination.interceptor';
import { InjectTerryToTerryCheckinInterceptor } from 'src/interceptors/terry-checkin/inject-terry-data-to-terry-checkin.interceptor';

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

  @EndpointConfig(
    TERRY_CHECKIN_ENDPOINT_CONFIG[
      ETerryCheckinOperation.HUNTER_FILTER_TERRY_CHECKINS
    ],
  )
  @AuthEndpoint({
    namespaces: [
      IamNamespace.GEOTERRY_ADMINS,
      IamNamespace.GEOTERRY_HUNTERS,
      IamNamespace.GEOTERRY_BUILDERS,
    ],
  })
  @UseInterceptors(InjectTerryToTerryCheckinInterceptor, PaginationInterceptor)
  @PaginationSwaggerQuery()
  @Post('filter')
  async filter(
    @Body() data: FilterTerryCheckinDto,
    @Param('profileId') profileId: string,
    @Pagination() pagination: IPagination,
  ) {
    return this.terryCheckinSvc.filter(data, profileId, pagination);
  }

  @EndpointConfig(
    TERRY_CHECKIN_ENDPOINT_CONFIG[
      ETerryCheckinOperation.HUNTER_UPDATE_TERRY_CHECKIN
    ],
  )
  @AuthEndpoint({
    namespaces: [
      IamNamespace.GEOTERRY_ADMINS,
      IamNamespace.GEOTERRY_HUNTERS,
      IamNamespace.GEOTERRY_BUILDERS,
    ],
  })
  @Put(':id')
  async update(
    @Body() data: UpdateTerryCheckinInputDto,
    @Param('profileId') profileId: string,
    @Param('id') id: string,
  ) {
    return this.terryCheckinSvc.update(data, id, profileId);
  }

  @EndpointConfig(
    TERRY_CHECKIN_ENDPOINT_CONFIG[
      ETerryCheckinOperation.HUNTER_GET_TERRY_CHECKIN
    ],
  )
  @AuthEndpoint({
    namespaces: [
      IamNamespace.GEOTERRY_ADMINS,
      IamNamespace.GEOTERRY_HUNTERS,
      IamNamespace.GEOTERRY_BUILDERS,
    ],
  })
  @Get(':id')
  async get(
    @Param('profileId') profileId: string,
    @Param('id') id: string,
    @Query() query: ReadTerryCheckinQueryDto,
  ) {
    return this.terryCheckinSvc.get(id, profileId, query);
  }

  @EndpointConfig(
    TERRY_CHECKIN_ENDPOINT_CONFIG[
      ETerryCheckinOperation.HUNTER_DELETE_TERRY_CHECKIN
    ],
  )
  @AuthEndpoint({
    namespaces: [
      IamNamespace.GEOTERRY_ADMINS,
      IamNamespace.GEOTERRY_HUNTERS,
      IamNamespace.GEOTERRY_BUILDERS,
    ],
  })
  @Delete(':id')
  async delete(@Param('profileId') profileId: string, @Param('id') id: string) {
    return this.terryCheckinSvc.delete(id, profileId);
  }
}
