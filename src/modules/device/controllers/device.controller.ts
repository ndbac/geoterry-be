import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DeviceService } from '../providers/device.service';
import { DEVICE_ENDPOINT_CONFIG, EDeviceOperation } from './endpoint-config';
import { IamNamespace } from 'src/shared/types';
import { EndpointConfig } from 'src/decorators/endpoint-config.decorator';
import { AuthEndpoint } from 'src/decorators/auth-endpoint.decorator';
import { CreateOrUpdateDeviceInputDto } from '../dto/device.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { I18nExceptionFilter } from 'src/filters/i18n-exception.filter';
import { ProfileAccessGuard } from 'src/guards/store-access.guard';

@Controller('hunter/:profileId/device')
@ApiTags('hunter.device')
@UseFilters(I18nExceptionFilter)
@UseGuards(AuthGuard, ProfileAccessGuard)
@ApiBearerAuth()
export class DeviceController {
  constructor(private readonly deviceSvc: DeviceService) {}

  @Post()
  @EndpointConfig(
    DEVICE_ENDPOINT_CONFIG[EDeviceOperation.USER_CREATE_OR_UPDATE_DEVICE],
  )
  @AuthEndpoint({
    namespaces: [
      IamNamespace.GEOTERRY_ADMINS,
      IamNamespace.GEOTERRY_HUNTERS,
      IamNamespace.GEOTERRY_BUILDERS,
    ],
  })
  updateDevice(
    @Param('profileId') profileId: string,
    @Body() data: CreateOrUpdateDeviceInputDto,
  ) {
    return this.deviceSvc.updateOrCreateDevice(profileId, data);
  }

  @Delete()
  @EndpointConfig(DEVICE_ENDPOINT_CONFIG[EDeviceOperation.USER_DELETE_DEVICE])
  @AuthEndpoint({
    namespaces: [
      IamNamespace.GEOTERRY_ADMINS,
      IamNamespace.GEOTERRY_HUNTERS,
      IamNamespace.GEOTERRY_BUILDERS,
    ],
  })
  delete(@Param('profileId') profileId: string) {
    return this.deviceSvc.deleteDevice(profileId);
  }
}
