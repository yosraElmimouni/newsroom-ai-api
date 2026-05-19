import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);

  constructor(
  @InjectDataSource('default')
  private readonly defaultDataSource: DataSource,

  @InjectDataSource('backup')
  private readonly backupDataSource: DataSource,
) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async syncDatabase() {
    try {
      const entities = this.defaultDataSource.entityMetadatas;

      for (const entity of entities) {
        const entityClass = entity.target as any;

        const repo = this.defaultDataSource.getRepository(entityClass);
        const backupRepo = this.backupDataSource.getRepository(entityClass);

        const sourceData = await repo.find();

        const backupData = await backupRepo.find({
          select: ['id'],
        });

        const backupIds = new Set(backupData.map((b: any) => b.id));

        const toInsert: any[] = [];
        const toUpdate: any[] = [];

        for (const item of sourceData) {
          if (backupIds.has((item as any).id)) {
            toUpdate.push(item);
          } else {
            toInsert.push(item);
          }
        }

        if (toInsert.length > 0) {
          await backupRepo.save(toInsert as any);
        }

        if (toUpdate.length > 0) {
          await backupRepo.save(toUpdate as any);
        }

        this.logger.log(
          `${entity.tableName} : ${toInsert.length} new, ${toUpdate.length} updated`
        );
      }

      this.logger.log(' Backup terminé avec succès');
    } catch (error) {
      this.logger.error(' Erreur backup', error);
    }
  }
}