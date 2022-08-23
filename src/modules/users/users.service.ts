import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { createUserDTO } from 'src/dtos/createUser.dto';
import { Article } from 'src/entities/article.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Article) private articleRepository: Repository<Article>,
  ) {}

  public getUser(username: string) {
    return this.userRepository.findOneBy({ username: username });
  }

  public async createUser(user: createUserDTO) {
    const { username, password, email } = user;

    if (!username || !password || !email)
      throw new Error('Not all parameters are provided for creating an user!');

    const userCheck1: User[] = await this.userRepository.find({
      where: { email: email },
    });

    if (userCheck1.length != 0)
      throw new Error('User with set email already exists!');

    const userCheck2: User[] = await this.userRepository.find({
      where: { username: username },
    });

    if (userCheck2.length != 0)
      throw new Error('User with set username already exists!');

    const newUser: User = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  public async getProfileData(id: number) {
    const user: User = await this.userRepository.findOne({
      where: { id: id },
      relations: { articles: true },
    });

    if (!user) return {};

    let i = 0;
    let sum = 0;

    if (user.articles) {
      user.articles.forEach((article: Article) => {
        if (article.averageScore) {
          i++;
          sum += article.averageScore;
        }
      });
    }

    let averageScore: number;

    if (i == 0) averageScore = 0;
    else {
      averageScore = Math.round((sum / i) * 100) / 100;
    }

    if (user.articles) i = user.articles.length;
    else i = 0;

    return {
      username: user.username,
      userId: user.id,
      numberOfArticles: i,
      averageArticleScore: averageScore,
    };
  }
}
