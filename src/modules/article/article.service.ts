import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createArticleDTO } from 'src/dtos/createArticle.dto';
import { Article } from 'src/entities/article.entity';
//import { Report } from 'src/entities/report.entity';
import { Review } from 'src/entities/review.entity';
import { User } from 'src/entities/user.entity';
import { BookGenre } from 'src/enums/book-genre.enum';
import { Repository } from 'typeorm';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private articleRepository: Repository<Article>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Review) private reviewRepository: Repository<Review>, // @InjectRepository(Report) private reportRepository: Repository<Report>,
  ) {}

  public async createArticle(articleInfo: createArticleDTO) {
    const user: User | null = await this.userRepository.findOneBy({
      id: articleInfo.userId,
    });

    if (!user) throw new Error('User not found while creating an article!');

    const data = {
      user: user,
      ...articleInfo,
      genre: <BookGenre>articleInfo.genre,
    };

    const newArticle = this.articleRepository.create(data);
    return this.articleRepository.save(newArticle);
  }

  public getAll() {
    return this.articleRepository.find();
  }

  public async getArticlesForId(id: number) {
    const user: User | null = await this.userRepository.findOneBy({ id: id });
    return this.articleRepository.findBy({ user: user });
  }

  public async deleteArticle(id: number) {
    const article = await this.articleRepository.findOneBy({ id: id });
    const reviews = await this.reviewRepository.findBy({ article: article });
    //const reports = await this.reportRepository.findBy({ article: article });

    //this.reportRepository.remove(reports);
    this.reviewRepository.remove(reviews);

    return this.articleRepository.remove(article);
  }
}
