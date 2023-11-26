import { HttpStatus } from '@nestjs/common';
import { IEndpointConfiguration } from 'src/shared/types';
import { ConversationResDto } from '../dto/conversation.dto';

export enum EConversationOperation {
  HUNTER_FILTER_CONVERSATIONS = 'hunterFilterConversations',
}

export const CONVERSATION_ENDPOINT_CONFIG: Record<
  EConversationOperation,
  IEndpointConfiguration
> = {
  [EConversationOperation.HUNTER_FILTER_CONVERSATIONS]: {
    operationId: EConversationOperation.HUNTER_FILTER_CONVERSATIONS,
    summary: 'Hunter filter conversation',
    responses: [
      {
        type: [ConversationResDto],
        status: HttpStatus.OK,
      },
    ],
  },
};
