import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createArticleDTO } from 'src/dtos/createArticle.dto';
import { Article } from 'src/entities/article.entity';
import { User } from 'src/entities/user.entity';
import { BookGenre } from 'src/enums/book-genre.enum';
import { Repository } from 'typeorm';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article) private articleRepository: Repository<Article>,
    @InjectRepository(User) private userRepository: Repository<User>,
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
}
