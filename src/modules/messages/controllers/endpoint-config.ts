import { HttpStatus } from '@nestjs/common';
import { IEndpointConfiguration } from 'src/shared/types';
import { MessageResDto } from '../dto/message.dto';

export enum EMessageOperation {
  HUNTER_READ_CONVERSATION_MESSAGES = 'hunterReadConversationMessages',
}

export const MESSAGE_ENDPOINT_CONFIG: Record<
  EMessageOperation,
  IEndpointConfiguration
> = {
  [EMessageOperation.HUNTER_READ_CONVERSATION_MESSAGES]: {
    operationId: EMessageOperation.HUNTER_READ_CONVERSATION_MESSAGES,
    summary: 'Hunter get conversation message',
    responses: [
      {
        type: [MessageResDto],
        status: HttpStatus.OK,
      },
    ],
  },
};
