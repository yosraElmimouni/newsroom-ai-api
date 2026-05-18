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
    return await this.analyseRepository.find();
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
}
