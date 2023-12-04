import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { from } from 'rxjs';
import { convertObject } from 'src/shared/mongoose/helpers';
import { Document2Interface } from 'src/shared/mongoose/types';
import _ from 'lodash';
import { mergeMap } from 'rxjs/operators';
import { ConversationDocument } from 'src/modules/conversations/conversations.model';
import { MessageRepository } from 'src/modules/messages/messages.repository';
import { MessageDocument } from 'src/modules/messages/messages.model';
import config from 'config';

@Injectable()
export class InjectMessageToConversationInterceptor implements NestInterceptor {
  constructor(private readonly messageRepo: MessageRepository) {}
  intercept(
    ctx: ExecutionContext,
    next: CallHandler<
      | Document2Interface<ConversationDocument>
      | Document2Interface<ConversationDocument>[]
    >,
  ) {
    if (ctx.switchToHttp().getRequest().query['prefetchMessage'] !== 'true')
      return next.handle();
    return next
      .handle()
      .pipe(mergeMap((data) => from(this.injectData(convertObject(data)))));
  }

  async injectData(
    data:
      | Document2Interface<ConversationDocument>
      | Document2Interface<ConversationDocument>[],
  ) {
    const messagesMappedByConvId = await this.getMessagesMappedByConvId(
      Array.isArray(data) ? data : [data],
    );
    if (Array.isArray(data)) {
      data.forEach((conv) => {
        (conv as any).messages = this.addMessagesDataToConversation(
          conv,
          messagesMappedByConvId,
        );
      });
    } else {
      (data as any).messages = this.addMessagesDataToConversation(
        data,
        messagesMappedByConvId,
      );
    }
    return data;
  }

  addMessagesDataToConversation(
    conversation: Document2Interface<ConversationDocument>,
    messagesMappedByConvId: _.Dictionary<MessageDocument[]>,
  ) {
    return messagesMappedByConvId[conversation.id];
  }

  async getMessagesMappedByConvId(
    conversations: Document2Interface<ConversationDocument>[],
  ) {
    const messages = await this.messageRepo.find(
      {
        conversationId: { $in: conversations.map((conv) => conv.id) },
      },
      {
        sort: { sentAt: -1 },
        limit: config.get<number>('chat.conversation.prefetchMessageCount'),
      },
    );
    return _.groupBy(messages, 'conversationId');
  }
}
