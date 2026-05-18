import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NewsItemService } from '../services/news-item.service';
import { CreateNewsItemDto } from '../dto/create-news-item.dto';
import { UpdateNewsItemDto } from '../dto/update-news-item.dto';

@Controller('news-item')
export class NewsItemController {
  constructor(private readonly newsItemService: NewsItemService) {}

  @Post()
  create(@Body() createNewsItemDto: CreateNewsItemDto) {
    return this.newsItemService.create(createNewsItemDto);
  }

  @Get()
  findAll() {
    return this.newsItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newsItemService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNewsItemDto: UpdateNewsItemDto) {
    return this.newsItemService.update(+id, updateNewsItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.newsItemService.remove(+id);
  }
}
