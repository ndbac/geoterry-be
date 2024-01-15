import { BadRequestException, Injectable } from '@nestjs/common';
import { MessageRepository } from '../messages.repository';
import { GetConversationMessagesOptions } from '../dto/message-common.dto';
import { IPagination } from 'src/shared/types';
import { getPaginationHeaders } from 'src/shared/pagination.helpers';
import { ConversationRepository } from 'src/modules/conversations/conversations.repository';
import { SendMessageInputDto } from '../dto/create-message.dto';
import { ConversationDocument } from 'src/modules/conversations/conversations.model';
import _ from 'lodash';
import { RtdbService } from 'src/modules/adapters/firebase/rtdb.provider';
import { getMessagePath } from 'src/shared/firebase.helpers';
import { convertObject } from 'src/shared/mongoose/helpers';
import { ProfileRepository } from 'src/modules/profile/profile.repository';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepo: MessageRepository,
    private readonly conversationRepo: ConversationRepository,
    private readonly rtdbSvc: RtdbService,
    private readonly profileRepo: ProfileRepository,
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

  async sendMessage(profileId: string, input: SendMessageInputDto) {
    return this.messageRepo.withTransaction(async (session) => {
      let conversation: ConversationDocument | undefined = undefined;
      let isNewConversation = false;
      // Send to old conversation
      if (input.conversationId) {
        conversation = await this.conversationRepo.findByIdOrFail(
          input.conversationId,
          { session },
        );
        await this.conversationRepo.updateById(
          conversation.id,
          {
            msgCount: conversation.msgCount + 1,
            lastMsg: {
              snippet: input.payload.text || input.payload.mediaUrl,
              sentAt: new Date(),
              sentByProfileId: profileId,
            },
            participants: [
              {
                profileId,
                unreadMsgCnt: 0,
              },
              {
                profileId:
                  conversation.participants[0].profileId === profileId
                    ? conversation.participants[1].profileId
                    : conversation.participants[0].profileId,
                unreadMsgCnt:
                  (conversation.participants.find(
                    (participant) => participant.profileId !== profileId,
                  )?.unreadMsgCnt || 0) + 1,
              },
            ],
          },
          { session },
        );
      } else if (input.recipientId) {
        const existed = await this.conversationRepo.exists({
          'participants.profileId': { $all: [profileId, input.recipientId] },
        });
        if (existed) {
          throw new BadRequestException({
            message: `Conververstaion with recipient ID: ${input.recipientId} is already initilized!`,
            sentryAlertDisabled: true,
          });
        }
        // Initilize conversation
        conversation = await this.conversationRepo.create(
          {
            participants: [
              {
                profileId,
                unreadMsgCnt: 0,
              },
              {
                profileId: input.recipientId,
                unreadMsgCnt: 1,
              },
            ],
            msgCount: 1,
            lastMsg: {
              snippet: input.payload.text || input.payload.mediaUrl,
              sentAt: new Date(),
              sentByProfileId: profileId,
            },
          },
          { session },
        );
        isNewConversation = true;
      }

      if (_.isNil(conversation)) return;

      const recipientId =
        conversation.participants[0].profileId === profileId
          ? conversation.participants[1].profileId
          : conversation.participants[0].profileId;

      const message = await this.messageRepo.create(
        {
          conversationId: conversation.id,
          senderId: profileId,
          recipientId,
          payload: input.payload,
          sentAt: new Date(),
        },
        { session },
      );

      const dataToSendToRtdb = {
        ..._.omit(convertObject(message), ['createdAt', 'updatedAt', '_id']),
        chatServiceId: message.id,
      } as any;
      if (input.recipientId && isNewConversation) {
        const sender = await this.profileRepo.findByIdOrFail(profileId, {
          session,
        });
        dataToSendToRtdb.sender = {
          displayName: sender.displayName,
          ...(sender.logoUrl ? { logoUrl: sender.logoUrl } : {}),
        };
      }
      await this.rtdbSvc.create(
        getMessagePath(recipientId, ''),
        dataToSendToRtdb,
        {
          addId: true,
        },
      );

      return message;
    });
  }
}
