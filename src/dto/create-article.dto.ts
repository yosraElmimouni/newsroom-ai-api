import { ArticleStatus } from 'src/enums/ArticleStatus';
import { CategorieArticle } from 'src/enums/CategorieArticle';

export class CreateArticleDto {
  titre!: string;
  contenu?: string;
  statut?: ArticleStatus;        // ← enum au lieu de string
  categorie?: CategorieArticle;  // ← enum au lieu de string
  tags?: string[];
  auteurId!: number;
}