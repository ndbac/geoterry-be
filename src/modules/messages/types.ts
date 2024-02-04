export enum EMessageType {
  TEXT = 'text',
  IMAGE = 'image',
}

export interface ISendNewConversationNotification {
  senderProfileId: string;
  recipientId: string;
  conversationId: string;
  imageUrl?: string;
  name: string;
  message: string;
}
