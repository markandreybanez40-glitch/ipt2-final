export type NotificationType = "status_update" | "announcement" | "system" | "action_required";

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  date: string;
  read: boolean;
  linkUrl?: string;
  reportId?: string;
}
