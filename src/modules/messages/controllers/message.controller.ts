import {
  Controller,
  Get,
  Param,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { I18nExceptionFilter } from 'src/filters/i18n-exception.filter';
import { AuthGuard } from 'src/guards/auth.guard';
import { ProfileAccessGuard } from 'src/guards/profile-access.guard';
import { MessageService } from '../providers/message.service';
import {
  Pagination,
  PaginationSwaggerQuery,
} from 'src/decorators/pagination.decorator';
import { IPagination, IamNamespace } from 'src/shared/types';
import { PaginationInterceptor } from 'src/interceptors/pagination.interceptor';
import { AuthEndpoint } from 'src/decorators/auth-endpoint.decorator';
import { EMessageOperation, MESSAGE_ENDPOINT_CONFIG } from './endpoint-config';
import { EndpointConfig } from 'src/decorators/endpoint-config.decorator';
import { GetConversationMessagesOptions } from '../dto/message-common.dto';

@Controller('user/:profileId/conversation/:conversationId/messages')
@ApiTags('user.messages')
@UseGuards(AuthGuard, ProfileAccessGuard)
@UseFilters(I18nExceptionFilter)
@ApiBearerAuth()
export class MessageController {
  constructor(private readonly messageSvc: MessageService) {}

  @EndpointConfig(
    MESSAGE_ENDPOINT_CONFIG[
      EMessageOperation.HUNTER_READ_CONVERSATION_MESSAGES
    ],
  )
  @AuthEndpoint({
    namespaces: [
      IamNamespace.GEOTERRY_ADMINS,
      IamNamespace.GEOTERRY_BUILDERS,
      IamNamespace.GEOTERRY_HUNTERS,
    ],
  })
  @UseInterceptors(PaginationInterceptor)
  @PaginationSwaggerQuery()
  @Get('filter')
  filter(
    @Param('conversationId') conversationId: string,
    @Query() options: GetConversationMessagesOptions,
    @Pagination() pagination: IPagination,
  ) {
    return this.messageSvc.getConvMessages(conversationId, options, pagination);
  }
}
