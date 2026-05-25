import { Body, Injectable, NotFoundException, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CreateMediaDto } from '../dto/create-media.dto';
import { UpdateMediaDto } from '../dto/update-media.dto';
import { Media } from 'src/entities/media.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { MediaType } from 'src/enums/MediaType';
import * as streamifier from 'streamifier';
import { v2 as cloudinary } from 'cloudinary';
@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly analyseRepository: Repository<Media>,
  ) {}

  async create(createMediaDto: CreateMediaDto) {
    const Media = this.analyseRepository.create(createMediaDto);

    return await this.analyseRepository.save(Media);
  }

  async findAll() {
    return await this.analyseRepository.find();
  }

  findOne(id: number) {
    return this.analyseRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateMediaDto: UpdateMediaDto) {
    const Media = await this.findOne(id);
    if (!Media) {
      throw new NotFoundException();
    }
    Object.assign(Media, updateMediaDto);

    return await this.analyseRepository.save(Media);
  }

  async remove(id: number) {
    const Media = await this.findOne(id);
    if (!Media) {
      throw new NotFoundException();
    }
    return await this.analyseRepository.remove(Media);
  }
  async getMediasByArticle(articleId: number) {
    return await this.analyseRepository.find({
      where: {
        article: {
          id: articleId,
        },
      },
    });
  }

    
 
 
}
