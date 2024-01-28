import { HttpStatus } from '@nestjs/common';
import { IEndpointConfiguration } from 'src/shared/types';
import {
  ConversationResDto,
  ConversationStatResDto,
} from '../dto/conversation.dto';

export enum EConversationOperation {
  HUNTER_FILTER_CONVERSATIONS = 'hunterFilterConversations',
  HUNTER_FILTER_CONVERSATION_STAT = 'hunterFilterConversationStat',
}

export const CONVERSATION_ENDPOINT_CONFIG: Record<
  EConversationOperation,
  IEndpointConfiguration
> = {
  [EConversationOperation.HUNTER_FILTER_CONVERSATIONS]: {
    operationId: EConversationOperation.HUNTER_FILTER_CONVERSATIONS,
    summary: 'Hunter filter conversation',
    query: [
      {
        name: 'includeProfileData',
        type: Boolean,
        required: false,
      },
      {
        name: 'prefetchMessage',
        type: Boolean,
        required: false,
      },
    ],
    responses: [
      {
        type: [ConversationResDto],
        status: HttpStatus.OK,
      },
    ],
  },
  [EConversationOperation.HUNTER_FILTER_CONVERSATION_STAT]: {
    operationId: EConversationOperation.HUNTER_FILTER_CONVERSATION_STAT,
    summary: 'Hunter filter conversation stat',
    responses: [
      {
        type: ConversationStatResDto,
        status: HttpStatus.OK,
      },
    ],
  },
};
