import {
  Controller,
  Param,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { I18nExceptionFilter } from 'src/filters/i18n-exception.filter';
import { AuthGuard } from 'src/guards/auth.guard';
import { ProfileAccessGuard } from 'src/guards/profile-access.guard';
import { ConversationService } from '../providers/conversation.service';
import {
  Pagination,
  PaginationSwaggerQuery,
} from 'src/decorators/pagination.decorator';
import { IPagination, IamNamespace } from 'src/shared/types';
import { PaginationInterceptor } from 'src/interceptors/pagination.interceptor';
import { AuthEndpoint } from 'src/decorators/auth-endpoint.decorator';
import { EndpointConfig } from 'src/decorators/endpoint-config.decorator';
import {
  CONVERSATION_ENDPOINT_CONFIG,
  EConversationOperation,
} from './endpoint-config';
import { InjectProfileDataToConversationInterceptor } from 'src/interceptors/conversation/inject-user-profile-to-conversation.interceptor';
import { InjectMessageToConversationInterceptor } from 'src/interceptors/conversation/inject-message-to-conversation.interceptor';

@Controller('hunter/:profileId/conversations')
@ApiTags('hunter.conversations')
@UseGuards(AuthGuard, ProfileAccessGuard)
@UseFilters(I18nExceptionFilter)
@ApiBearerAuth()
export class ConversationController {
  constructor(private readonly conversationSvc: ConversationService) {}

  @EndpointConfig(
    CONVERSATION_ENDPOINT_CONFIG[
      EConversationOperation.HUNTER_FILTER_CONVERSATIONS
    ],
  )
  @AuthEndpoint({
    namespaces: [
      IamNamespace.GEOTERRY_ADMINS,
      IamNamespace.GEOTERRY_BUILDERS,
      IamNamespace.GEOTERRY_HUNTERS,
    ],
  })
  @UseInterceptors(
    InjectMessageToConversationInterceptor,
    InjectProfileDataToConversationInterceptor,
    PaginationInterceptor,
  )
  @PaginationSwaggerQuery()
  @Post('filter')
  filter(
    @Param('profileId') profileId: string,
    @Pagination() pagination: IPagination,
  ) {
    return this.conversationSvc.filterConversations(profileId, pagination);
  }
}
