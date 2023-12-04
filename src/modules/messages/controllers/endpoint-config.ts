import { HttpStatus } from '@nestjs/common';
import { IEndpointConfiguration } from 'src/shared/types';
import { MessageResDto } from '../dto/message.dto';
import { SendMessageInputDto } from '../dto/create-message.dto';

export enum EMessageOperation {
  HUNTER_READ_CONVERSATION_MESSAGES = 'hunterReadConversationMessages',
  HUNTER_SEND_MESSAGE = 'hunterSendMessage',
}

export const MESSAGE_ENDPOINT_CONFIG: Record<
  EMessageOperation,
  IEndpointConfiguration
> = {
  [EMessageOperation.HUNTER_READ_CONVERSATION_MESSAGES]: {
    operationId: EMessageOperation.HUNTER_READ_CONVERSATION_MESSAGES,
    summary: 'Hunter get conversation message',
    params: [
      {
        name: 'profileId',
      },
    ],
    responses: [
      {
        type: [MessageResDto],
        status: HttpStatus.OK,
      },
    ],
  },
  [EMessageOperation.HUNTER_SEND_MESSAGE]: {
    operationId: EMessageOperation.HUNTER_SEND_MESSAGE,
    summary: 'Hunter send chat message',
    body: {
      type: SendMessageInputDto,
    },
    responses: [
      {
        status: HttpStatus.CREATED,
        type: MessageResDto,
      },
    ],
  },
};
