import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import e from 'express';
import { createReviewDTO } from 'src/dtos/createReview.dto';
import { Article } from 'src/entities/article.entity';
import { Review } from 'src/entities/review.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
    @InjectRepository(Article) private articleRepository: Repository<Article>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  public getAll() {
    return this.reviewRepository.find();
  }

  public async getReviewsForArticle(id: number) {
    const article = await this.articleRepository.findOneBy({ id: id });
    return this.reviewRepository.findBy({ article: article });
  }

  public async createReview(reviewData: createReviewDTO) {
    const user: User = await this.userRepository.findOneBy({
      id: reviewData.userID,
    });
    const article: Article = await this.articleRepository.findOneBy({
      id: reviewData.articleID,
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
    };

    const newReview = this.reviewRepository.create(review);
    return this.reviewRepository.save(newReview);
  }
}
