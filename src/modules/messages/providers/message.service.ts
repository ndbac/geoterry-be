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
import { FcmService } from 'src/modules/adapters/firebase/fcm.provider';
import { DeviceRepository } from 'src/modules/device/device.repository';
import { ClientSession } from 'mongoose';
import { NotificationCompilers } from '../../notification/providers/noti-compiler';
import { ENotificationEvent } from 'src/modules/notification/types';
import { ISendNewConversationNotification } from '../types';
import { errorLog } from 'src/shared/logger/logger.helpers';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepo: MessageRepository,
    private readonly conversationRepo: ConversationRepository,
    private readonly rtdbSvc: RtdbService,
    private readonly profileRepo: ProfileRepository,
    private readonly fcmService: FcmService,
    private readonly deviceRepo: DeviceRepository,
    private readonly notiCompilers: NotificationCompilers,
  ) {}

  async getConvMessages(
    conversationId: string,
    profileId: string,
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
          {
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
        const existed = await this.conversationRepo.exists(
          {
            'participants.profileId': { $all: [profileId, input.recipientId] },
          },
          { session },
        );
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
        await this.sendNewConversationNotification(
          {
            senderProfileId: message.senderId,
            conversationId: message.conversationId,
            recipientId: message.recipientId,
            imageUrl: sender.logoUrl,
            name: sender.displayName,
            message: message.payload.text || message.payload.mediaUrl || '',
          },
          { session },
        );
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

  private readonly sendNewConversationNotification = async (
    payload: ISendNewConversationNotification,
    options?: { session?: ClientSession },
  ) => {
    try {
      const device = await this.deviceRepo.findOne(
        {
          profileId: payload.recipientId,
          enabled: true,
        },
        { session: options?.session },
      );

      if (!device) return;

      const recipient = await this.profileRepo.findByIdOrFail(
        payload.recipientId,
        {
          session: options?.session,
        },
      );
      const notiPayload = this.notiCompilers.compile(
        {
          imageUrl: payload.imageUrl,
          name: payload.name,
          message: payload.message,
        },
        ENotificationEvent.ON_NEW_CONVERSATION,
        recipient.languageCode,
      );
      await this.fcmService.sendPushNotification(device.fcmToken, notiPayload, {
        senderProfileId: payload.senderProfileId,
        conversationId: payload.conversationId,
      });
    } catch (error) {
      errorLog(
        error,
        `Error when sending new conversation notification to recipient: ${payload.recipientId}!`,
      );
    }
  };
}
