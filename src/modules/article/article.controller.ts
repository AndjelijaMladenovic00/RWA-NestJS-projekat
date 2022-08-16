import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { createArticleDTO } from 'src/dtos/createArticle.dto';
import { UpdateArticleDTO } from 'src/dtos/updateArticle.dto';
import { Article } from 'src/entities/article.entity';
import { ArticleService } from './article.service';

@Controller('articles')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @UseGuards(JwtAuthGuard)
  @Get('getArticlesForId/:id')
  public getArticlesForId(@Param('id', ParseIntPipe) id: number) {
    return this.articleService.getArticlesForId(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('deleteArticle/:id')
  public deleteArticle(@Param('id', ParseIntPipe) id: number) {
    this.articleService.deleteArticle(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('createArticle')
  public createArticle(@Body() article: createArticleDTO): Promise<Article> {
    return this.articleService.createArticle(article);
  }

  @Get('all')
  public getAll() {
    return this.articleService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Put('updateArticle')
  public updateArticle(@Body() data: UpdateArticleDTO) {
    return this.articleService.updateArticle(data);
  }
}
