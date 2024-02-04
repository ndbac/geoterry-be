import { Injectable } from '@nestjs/common';
import { ENotificationEvent, ICompileConversationNotiData } from '../types';
import { INotification } from 'src/modules/adapters/firebase/types';
import { LanguageCode } from 'src/shared/types';

@Injectable()
export class NotificationCompilers {
  compile(
    data: ICompileConversationNotiData,
    type: ENotificationEvent,
    languageCode?: LanguageCode,
  ): INotification {
    switch (type) {
      case ENotificationEvent.ON_NEW_CONVERSATION:
        if (languageCode === LanguageCode.ENGLISH) {
          return {
            title: `${data.name || 'Someone'} wants to connect with you`,
            body: data.message,
            imageUrl: data.imageUrl,
          };
        }
        return {
          title: `${data.name || 'Ai đó'} muốn trò chuyện với bạn`,
          body: data.message,
          imageUrl: data.imageUrl,
        };
      default:
        return {};
    }
  }
}
