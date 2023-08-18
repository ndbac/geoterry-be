import { Injectable } from '@nestjs/common';
import { ConversationRepository } from '../conversations.repository';

@Injectable()
export class ConversationService {
  constructor(private readonly conversationRepo: ConversationRepository) {}
}
