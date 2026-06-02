import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ArticleService } from './../services/article.service';
import { CreateArticleDto } from '../dto/create-article.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';
import { get } from 'http';
import { ArticleStatus } from 'src/enums/ArticleStatus';


@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto);
  }

  @Get()
  findAll() {
    return this.articleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(+id, updateArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(+id);
  }

  @Get('count/status/:statut')
countByStatus(@Param('statut') statut: ArticleStatus) {
  return this.articleService.countByStatus(statut);
}

  @Get('status/:statut')
  getByStatut(@Param('statut') statut: ArticleStatus) {
    return this.articleService.getByStatus(statut as any);
  }

  @Get('count/status/:statut/author/:auteurId')
  countByStatusAndAuthor(
    @Param('statut') statut: ArticleStatus,
    @Param('auteurId') auteurId: number,
  ) {
    return this.articleService.countByStatusAndAuthor(statut, auteurId);
  }

  @Get('status/:statut/author/:auteurId')
  getByStatusAndAuthor(
    @Param('statut') statut: ArticleStatus,
    @Param('auteurId') auteurId: number,
  ) {
    return this.articleService.getByStatusAndAuthor(statut, auteurId);
  }
}
