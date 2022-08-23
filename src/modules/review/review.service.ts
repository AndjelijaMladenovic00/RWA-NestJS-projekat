import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createReviewDTO } from 'src/dtos/createReview.dto';
import { Article } from 'src/entities/article.entity';
import { Review } from 'src/entities/review.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { Notification } from 'src/entities/notification.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
    @InjectRepository(Article) private articleRepository: Repository<Article>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  public getAll() {
    return this.reviewRepository.find();
  }

  public async getReviewsForArticle(id: number) {
    const article: Article = await this.articleRepository.findOne({
      where: { id: id },
      relations: { reviews: true },
    });
    if (!article || !article.reviews || article.reviews.length == 0) return [];
    const reviews = [];
    for (let i = 0; i < article.reviews.length; i++) {
      const review = await this.reviewRepository.findOne({
        where: { id: article.reviews[i].id },
        relations: { user: true },
      });
      const data = {
        id: review.id,
        score: review.score,
        comment: review.comment,
        username: review.user.username,
        reviewedOn: review.reviewedOn,
      };
      reviews.push(data);
    }

    return reviews;
  }

  public async createReview(reviewData: createReviewDTO) {
    const user: User = await this.userRepository.findOneBy({
      id: reviewData.userID,
    });

    const article: Article = await this.articleRepository.findOne({
      where: { id: reviewData.articleID },
      relations: { user: true },
    });

    const reviews = await this.reviewRepository.findAndCountBy({
      article: article,
    });

    const sum: number =
      reviews[0].reduce((acc: number, el: Review) => (acc += el.score), 0) +
      reviewData.score;

    const average: number = Math.round(((sum / (reviews[1] + 1)) * 100) / 100);

    article.averageScore = average;
    await this.articleRepository.save(article);

    const review = {
      article: article,
      comment: reviewData.comment,
      score: reviewData.score,
      user: user,
      reviewedOn: new Date(),
    };

    const notificationData = {
      user: article.user,
      corelatingArticleID: article.id,
      title: `New review on your article "${article.title}"`,
      message: `User ${user.username} has reviewed your article "${article.title}" and gave it a score of ${reviewData.score}! Check out the review!`,
      article: article,
      deleteArticleOnReception: false,
      corelatingUserID: user.id,
    };

    const notification: Notification =
      this.notificationRepository.create(notificationData);
    await this.notificationRepository.save(notification);

    const newReview = this.reviewRepository.create(review);
    return await this.reviewRepository.save(newReview);
  }
}
