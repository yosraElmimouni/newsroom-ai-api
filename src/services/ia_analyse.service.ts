import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateIaAnalyseDto } from '../dto/create-ia_analyse.dto';
import { UpdateIaAnalyseDto } from '../dto/update-ia_analyse.dto';
import { IAAnalyse } from '../entities/ia_analyse.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class IaAnalyseService {
  constructor(
    @InjectRepository(IAAnalyse)
    private readonly analyseRepository: Repository<IAAnalyse>,
  ) {}

  async create(dto: CreateIaAnalyseDto) {
    const analyse = this.analyseRepository.create({
      question: dto.question,
      resultat: dto.resultat,
      dateAnalyse: new Date(),
      user: { id: dto.userId } as any,
    });

    return await this.analyseRepository.save(analyse);
  }

  async findAll() {
    return await this.analyseRepository.find();
  }

  // Historique de conversation d'un utilisateur, du plus ancien au plus récent
  async findByUser(userId: number) {
    return await this.analyseRepository.find({
      where: { user: { id: userId } as any },
      order: { dateAnalyse: 'ASC' },
    });
  }

  findOne(id: number) {
    return this.analyseRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateIAAnalyseDto: UpdateIaAnalyseDto) {
    const IAAnalyse = await this.findOne(id);
    if (!IAAnalyse) {
      throw new NotFoundException();
    }
    Object.assign(IAAnalyse, updateIAAnalyseDto);

    return await this.analyseRepository.save(IAAnalyse);
  }

  async remove(id: number) {
    const IAAnalyse = await this.findOne(id);
    if (!IAAnalyse) {
      throw new NotFoundException();
    }
    return await this.analyseRepository.remove(IAAnalyse);
  }

  // Efface tout l'historique de conversation d'un utilisateur (nouvelle conversation)
  async removeByUser(userId: number) {
    await this.analyseRepository
      .createQueryBuilder()
      .delete()
      .from(IAAnalyse)
      .where('userId = :userId', { userId })
      .execute();

    return { success: true };
  }
}