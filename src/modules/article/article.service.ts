import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createArticleDTO } from 'src/dtos/createArticle.dto';
import { UpdateArticleDTO } from 'src/dtos/updateArticle.dto';
import { UpdateArticleScoreDTO } from 'src/dtos/uptateArticleScore.dto';
import { Article } from 'src/entities/article.entity';
import { Report } from 'src/entities/report.entity';
import { Review } from 'src/entities/review.entity';
import { User } from 'src/entities/user.entity';
import { BookGenre } from 'src/enums/book-genre.enum';
import { Repository } from 'typeorm';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private articleRepository: Repository<Article>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
    @InjectRepository(Report) private reportRepository: Repository<Report>,
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

  public async getArticlesForId(id: number) {
    const user: User | null = await this.userRepository.findOneBy({ id: id });
    return this.articleRepository.findBy({ user: user });
  }

  public async deleteArticle(id: number) {
    const article = await this.articleRepository.findOneBy({ id: id });
    const reviews = await this.reviewRepository.findBy({ article: article });
    const reports = await this.reportRepository.findBy({ article: article });

    this.reportRepository.remove(reports);
    await this.reviewRepository.remove(reviews);

    return this.articleRepository.remove(article);
  }

  public async updateArticle(data: UpdateArticleDTO) {
    const article = await this.articleRepository.findOneBy({ id: data.id });
    article.title = data.title;
    article.text = data.text;
    article.genre = data.genre;
    article.lastEdited = new Date();
    article.id = data.id;

    await this.articleRepository.update(data.id, article);
    return article;
  }

  public async getArticlesForFeed(id: number) {
    let articles: Article[] = await this.articleRepository.find({
      relations: { user: true },
    });
    articles = articles.filter((article: Article) => {
      const days: number =
        (new Date().getTime() - article.publishedOn.getTime()) /
        (1000 * 60 * 60 * 24);
      if (article.user.id != id && days < 10) return true;
      else return false;
    });
    articles = articles.sort((a: Article, b: Article) => {
      if (a.publishedOn > b.publishedOn) return -1;
      else if (a.publishedOn < b.publishedOn) return 1;
      else return 0;
    });
    const articlesData = articles.map((article: Article) => {
      return {
        id: article.id,
        userId: article.user.id,
        username: article.user.username,
        publishedOn: article.publishedOn,
        lastEdited: article.lastEdited,
        text: article.text,
        title: article.title,
        averageScore: article.averageScore,
        genre: article.genre,
      };
    });
    return articlesData;
  }

  public async updateArticleScore(data: UpdateArticleScoreDTO) {
    await this.articleRepository.update(data.id, { averageScore: data.score });
  }
}
