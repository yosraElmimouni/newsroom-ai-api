import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RevisionService } from '../services/revision.service';
import { CreateRevisionDto } from '../dto/create-revision.dto';
import { UpdateRevisionDto } from '../dto/update-revision.dto';

@Controller('revision')
export class RevisionController {
  constructor(private readonly revisionService: RevisionService) {}

  @Post()
  create(@Body() createRevisionDto: CreateRevisionDto) {
    return this.revisionService.create(createRevisionDto);
  }

  @Get()
  findAll() {
    return this.revisionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.revisionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRevisionDto: UpdateRevisionDto) {
    return this.revisionService.update(+id, updateRevisionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.revisionService.remove(+id);
  }
}
