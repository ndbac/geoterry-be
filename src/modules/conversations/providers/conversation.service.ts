import { Injectable } from '@nestjs/common';
import { ConversationRepository } from '../conversations.repository';
import { IPagination } from 'src/shared/types';
import { getPaginationHeaders } from 'src/shared/pagination.helpers';

@Injectable()
export class ConversationService {
  constructor(private readonly conversationRepo: ConversationRepository) {}

  async filterConversations(profileId: string, pagination: IPagination) {
    const data = await this.conversationRepo.find(
      { 'participants.profileId': { $in: [profileId] } },
      {
        skip: pagination.offset,
        limit: pagination.pageSize,
        sort: { 'lastMsg.sentAt': -1 },
      },
    );
    const total = await this.conversationRepo.countWithFindOption({
      'participants.profileId': { $in: [profileId] },
    });
    return {
      items: data,
      headers: getPaginationHeaders(pagination, total),
    };
  }
}
