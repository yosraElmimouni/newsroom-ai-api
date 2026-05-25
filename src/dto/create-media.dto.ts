// ✅ APRÈS
import { MediaType } from "src/enums/MediaType";
import { Article } from "src/entities/articles.entity";
import { User } from "src/entities/user.entity";

export class CreateMediaDto {
  type!: MediaType;
  urlFichier!: string;
  titre!: string;
  description?: string;
  localisation?: string;
  dateCapture?: Date;
  article?: { id: number };
  user?: { id: number };   // ← correspond à la relation dans l'entité
}