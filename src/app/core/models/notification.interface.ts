// models/notification.model.ts
export interface Notification {
  notificationId: number;
  notificationMessage: string;
  isRead: boolean;
  notificationTime: string; // Keep as string; format later
}
