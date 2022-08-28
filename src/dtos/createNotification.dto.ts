export interface createNotificationDTO {
  userID: number; //for whom!
  title: string;
  message: string;
  articleID: number | null;
  deleteArticleOnReception: boolean | null;
  corelatingUserID: number | null;
}
