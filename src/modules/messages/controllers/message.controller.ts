import {
  Body,
  Controller,
  Get,
  Param,
  Post,
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
import { SendMessageInputDto } from '../dto/create-message.dto';

@Controller('hunter/:profileId')
@ApiTags('hunter.messages')
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
  @Get('conversation/:conversationId/messages')
  filter(
    @Param('conversationId') conversationId: string,
    @Query() options: GetConversationMessagesOptions,
    @Pagination() pagination: IPagination,
  ) {
    return this.messageSvc.getConvMessages(conversationId, options, pagination);
  }

  @EndpointConfig(
    MESSAGE_ENDPOINT_CONFIG[EMessageOperation.HUNTER_SEND_MESSAGE],
  )
  @AuthEndpoint({
    namespaces: [
      IamNamespace.GEOTERRY_ADMINS,
      IamNamespace.GEOTERRY_BUILDERS,
      IamNamespace.GEOTERRY_HUNTERS,
    ],
  })
  @Post('messages/send-message')
  sendMessage(
    @Param('profileId') profileId: string,
    @Body() payload: SendMessageInputDto,
  ) {
    return this.messageSvc.sendMessage(profileId, payload);
  }
}
