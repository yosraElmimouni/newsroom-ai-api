import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IaAnalyseService } from '../services/ia_analyse.service';
import { CreateIaAnalyseDto } from '../dto/create-ia_analyse.dto';
import { UpdateIaAnalyseDto } from '../dto/update-ia_analyse.dto';

@Controller('ia-analyse')
export class IaAnalyseController {
  constructor(private readonly iaAnalyseService: IaAnalyseService) {}

  @Post()
  create(@Body() createIaAnalyseDto: CreateIaAnalyseDto) {
    return this.iaAnalyseService.create(createIaAnalyseDto);
  }

  @Get()
  findAll() {
    return this.iaAnalyseService.findAll();
  }

  // Historique de conversation d'un utilisateur (chargé au démarrage de l'assistant IA)
  @Get('history/:userId')
  findHistory(@Param('userId') userId: string) {
    return this.iaAnalyseService.findByUser(+userId);
  }

  // Efface l'historique d'un utilisateur (nouvelle conversation)
  @Delete('history/:userId')
  clearHistory(@Param('userId') userId: string) {
    return this.iaAnalyseService.removeByUser(+userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.iaAnalyseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIaAnalyseDto: UpdateIaAnalyseDto) {
    return this.iaAnalyseService.update(+id, updateIaAnalyseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.iaAnalyseService.remove(+id);
  }
}