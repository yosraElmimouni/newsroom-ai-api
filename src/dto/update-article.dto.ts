import { PartialType } from '@nestjs/mapped-types';
import { CreateArticleDto } from '../dto/create-article.dto';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {}
