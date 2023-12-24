export const getMessagePath = (
  profileId = '{profileId}',
  messageId = '{messageId}',
) => `/users/${profileId}/messages/${messageId}`;

export const getConversationPath = (
  profileId = '{profileId}',
  conversationId = '{conversationId}',
) => `/users/${profileId}/conversations/${conversationId}`;

export const getLocationPath = (profileId = '{profileId}') =>
  `/location/${profileId}`;
