import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
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
  async findAll(
   @Query('sourceId') sourceId?: number,
  @Query('date') date?: string,
  @Query('categorie') categorie?: string,
  ) {
    // Si aucun paramètre n'est passé, on retourne tout
    if (!sourceId && !date && !categorie) {
      return this.newsItemService.findAll();
    }

    // Sinon, on appelle une méthode de recherche filtrée
    return this.newsItemService.findWithFilters({
    sourceId: sourceId ? +sourceId : undefined, // Conversion en nombre
    date,
    categorie,
  });
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
