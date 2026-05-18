import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from '../dto/create-article.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';
import { Repository } from 'typeorm';
import { Article } from '../entities/articles.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async create(createArticleDto: CreateArticleDto) {
    const article = this.articleRepository.create(createArticleDto);

    return await this.articleRepository.save(article);
  }

  async findAll() {
    return await this.articleRepository.find();
  }

  findOne(id: number) {
    return this.articleRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    const article = await this.findOne(id);
    if (!article) {
      throw new NotFoundException();
    }
    Object.assign(article, updateArticleDto);

    return await this.articleRepository.save(article);
  }

  async remove(id: number) {
    const article = await this.findOne(id);
    if (!article) {
      throw new NotFoundException();
    }
    return await this.articleRepository.remove(article);
  }

  async createtitle(createArticleDto: CreateArticleDto) {
    const article = this.articleRepository.create({
      titre: createArticleDto.titre,
    });

    return await this.articleRepository.save(article);
  }
}
