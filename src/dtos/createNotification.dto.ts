export interface createNotificationDTO {
  userID: number; //for whom!
  title: string;
  message: string;
  articleID: number;
  deleteArticleOnReception: boolean;
}
