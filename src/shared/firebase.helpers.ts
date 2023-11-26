export const getMessagePath = (
  userId = '{userId}',
  messageId = '{messageId}',
) => `/users/${userId}/messages/${messageId}`;

export const getConversationPath = (
  userId = '{userId}',
  conversationId = '{conversationId}',
) => `/users/${userId}/conversations/${conversationId}`;
