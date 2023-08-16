export interface INotification {
  title?: string;
  body?: string;
  imageUrl?: string;
}
export interface INotificationWithToken extends INotification {
  token: string;
}
