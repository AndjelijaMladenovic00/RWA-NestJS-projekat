import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { createReviewDTO } from 'src/dtos/createReview.dto';
import { Review } from 'src/entities/review.entity';
import { ReviewService } from './review.service';

@Controller('reviews')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Get('all')
  public getAll() {
    return this.reviewService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('getReviewsForArticle/:id')
  public async getReviewsForArticle(@Param('id', ParseIntPipe) id: number) {
    const data = await this.reviewService.getReviewsForArticle(id);
    const result = data.reviews.map((rev) => {
      return {
        username: data.username,
        id: rev.id,
        articleId: id,
        comment: rev.comment,
        score: rev.score,
      };
    });
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post('createReview')
  public createReview(@Body() reviewData: createReviewDTO) {
    return this.reviewService.createReview(reviewData);
  }
}
