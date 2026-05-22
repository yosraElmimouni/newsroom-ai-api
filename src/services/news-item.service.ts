import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNewsItemDto } from '../dto/create-news-item.dto';
import { UpdateNewsItemDto } from '../dto/update-news-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { NewsItem } from 'src/entities/news-item.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NewsItemService {
  constructor(
    @InjectRepository(NewsItem)
    private readonly analyseRepository: Repository<NewsItem>,
  ) {}

  async create(createNewsItemDto: CreateNewsItemDto) {
    const NewsItem = this.analyseRepository.create(createNewsItemDto);

    return await this.analyseRepository.save(NewsItem);
  }

  async findAll() {
  return await this.analyseRepository
    .createQueryBuilder('news')
    .leftJoinAndSelect('news.source', 'source')
    .orderBy('news.datePublication', 'DESC')
    .getMany();
}

  findOne(id: number) {
    return this.analyseRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateNewsItemDto: UpdateNewsItemDto) {
    const NewsItem = await this.findOne(id);
    if (!NewsItem) {
      throw new NotFoundException();
    }
    Object.assign(NewsItem, updateNewsItemDto);

    return await this.analyseRepository.save(NewsItem);
  }

  async remove(id: number) {
    const NewsItem = await this.findOne(id);
    if (!NewsItem) {
      throw new NotFoundException();
    }
    return await this.analyseRepository.remove(NewsItem);
  }

  async findWithFilters(filters: {
    sourceId?: number;
    date?: string;
    categorie?: string;
  }) {
    const queryBuilder = this.analyseRepository
      .createQueryBuilder('news')
      .leftJoinAndSelect('news.source', 'source'); // Jointure avec la table sources

    // Filtrage par ID de la source
    if (filters.sourceId) {
      queryBuilder.andWhere('source.id = :sourceId', {
        sourceId: filters.sourceId,
      });
    }

    // Filtrage par catégorie (énumération)
    if (filters.categorie) {
      queryBuilder.andWhere('news.categorie = :categorie', {
        categorie: filters.categorie,
      });
    }

    // Filtrage par date
    if (filters.date) {
      const start = new Date(filters.date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(filters.date);
      end.setHours(23, 59, 59, 999);

      queryBuilder.andWhere('news.datePublication BETWEEN :start AND :end', {
        start,
        end,
      });
    }

    return await queryBuilder.orderBy('news.datePublication', 'DESC').getMany();
  }
}
