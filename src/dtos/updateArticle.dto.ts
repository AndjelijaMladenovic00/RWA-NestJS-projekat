import { BookGenre } from 'src/enums/book-genre.enum';

export interface UpdateArticleDTO {
  id: number;
  title: string;
  text: string;
  genre: BookGenre;
}
