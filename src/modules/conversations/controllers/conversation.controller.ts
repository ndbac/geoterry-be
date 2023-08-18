import { Controller, UseFilters, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { I18nExceptionFilter } from 'src/filters/i18n-exception.filter';
import { AuthGuard } from 'src/guards/auth.guard';
import { ProfileAccessGuard } from 'src/guards/store-access.guard';
import { ConversationService } from '../providers/conversation.service';

@Controller('user/:profileId/conversations')
@ApiTags('user.conversations')
@UseGuards(AuthGuard, ProfileAccessGuard)
@UseFilters(I18nExceptionFilter)
@ApiBearerAuth()
export class ConversationController {
  constructor(private readonly conversationSvc: ConversationService) {}
}
