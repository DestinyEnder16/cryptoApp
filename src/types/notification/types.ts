export interface NotificationDetails {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationResponse {
  data: NotificationDetails[];
  meta: {
    count: number;
  };
}
