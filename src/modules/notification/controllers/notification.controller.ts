import { Body, Controller, Post, UseFilters, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthEndpoint } from 'src/decorators/auth-endpoint.decorator';
import { EndpointConfig } from 'src/decorators/endpoint-config.decorator';
import { I18nExceptionFilter } from 'src/filters/i18n-exception.filter';
import { AuthGuard } from 'src/guards/auth.guard';
import { IamNamespace } from 'src/shared/types';
import { NotificationService } from '../providers/notification.service';
import {
  ENotificationOperation,
  NOTIFITION_ENDPOINT_CONFIG,
} from './endpoint-config';
import { NotificationInputDto } from '../dto/notification-input.dto';

@Controller('admin/notification')
@ApiTags('admin.notification')
@UseFilters(I18nExceptionFilter)
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notiService: NotificationService) {}

  @EndpointConfig(
    NOTIFITION_ENDPOINT_CONFIG[ENotificationOperation.ADMIN_PUSH_NOTIFICATION],
  )
  @AuthEndpoint({
    namespaces: [IamNamespace.GEOTERRY_ADMINS],
  })
  @Post()
  async pushNotification(@Body() data: NotificationInputDto) {
    return this.notiService.pushNotification(data);
  }
}
