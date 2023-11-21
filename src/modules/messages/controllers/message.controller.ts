import { Controller, UseFilters, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { I18nExceptionFilter } from 'src/filters/i18n-exception.filter';
import { AuthGuard } from 'src/guards/auth.guard';
import { ProfileAccessGuard } from 'src/guards/profile-access.guard';
import { MessageService } from '../providers/message.service';

@Controller('user/:profileId/messages')
@ApiTags('user.messages')
@UseGuards(AuthGuard, ProfileAccessGuard)
@UseFilters(I18nExceptionFilter)
@ApiBearerAuth()
export class MessageController {
  constructor(private readonly messageSvc: MessageService) {}
}
