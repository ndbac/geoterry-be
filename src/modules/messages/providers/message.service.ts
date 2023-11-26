import { Injectable } from '@nestjs/common';
import { MessageRepository } from '../messages.repository';
import { GetConversationMessagesOptions } from '../dto/message-common.dto';
import { IPagination } from 'src/shared/types';
import { getPaginationHeaders } from 'src/shared/pagination.helpers';
import { ConversationRepository } from 'src/modules/conversations/conversations.repository';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepo: MessageRepository,
    private readonly conversationRepo: ConversationRepository,
  ) {}

  async getConvMessages(
    conversationId: string,
    options: GetConversationMessagesOptions,
    pagination: IPagination,
  ) {
    return this.messageRepo.withTransaction(async (session) => {
      const conversation = await this.conversationRepo.findByIdOrFail(
        conversationId,
        { session },
      );
      if (options?.markAllAsRead) {
        await this.conversationRepo.updateById(
          conversation.id,
          { unreadMsgCnt: 0 },
          { session },
        );
      }

      const data = await this.messageRepo.find(
        { conversationId },
        {
          skip: pagination.offset,
          limit: pagination.pageSize,
          sort: { sentAt: -1 },
          session,
        },
      );
      const total = await this.messageRepo.countWithFindOption(
        { conversationId },
        { session },
      );
      return {
        items: data,
        headers: getPaginationHeaders(pagination, total),
      };
    });
  }
}
