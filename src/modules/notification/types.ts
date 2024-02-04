export enum ENotificationEvent {
  ON_NEW_CONVERSATION = 'onNewConnection',
}

export interface ICompileConversationNotiData {
  imageUrl?: string;
  name?: string;
  message?: string;
}
