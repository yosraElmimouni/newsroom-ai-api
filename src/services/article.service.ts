import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArticleDto } from '../dto/create-article.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';
import { Repository } from 'typeorm';
import { Article } from '../entities/articles.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleStatus } from 'src/enums/ArticleStatus';
import { User } from 'src/entities/user.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createArticleDto: CreateArticleDto) {
    const { auteurId, ...rest } = createArticleDto;

    const auteur = await this.userRepository.findOne({
      where: { id: auteurId },
    });
    if (!auteur)
      throw new NotFoundException(`Utilisateur ${auteurId} introuvable`);

    const article = this.articleRepository.create({
      titre: rest.titre,
      contenu: rest.contenu,
      statut: rest.statut,
      categorie: rest.categorie,
      tags: rest.tags,
      auteur,
    });

    return await this.articleRepository.save(article);
  }

  async findAll() {
    return await this.articleRepository.find({
      relations: ['auteur', 'auteur.role'],
    });
  }

  findOne(id: number) {
    return this.articleRepository.findOne({
      where: { id },
      relations: ['auteur', 'auteur.role'],
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

  async getByStatus(status: ArticleStatus) {
    return await this.articleRepository.findBy({
      statut: status,
    });
  }

  async countByStatus(statut: ArticleStatus): Promise<number> {
    return await this.articleRepository.count({
      where: {
        statut,
      },
    });
  }

  async countByStatusAndAuthor(
    statut: ArticleStatus,
    auteurId: number,
  ): Promise<number> {
    return await this.articleRepository.count({
      where: {
        statut,
        auteur: { id: auteurId },
      },
    });
  }
}
