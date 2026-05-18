import { Module } from '@nestjs/common';
import { RevisionService } from '../services/revision.service';
import { RevisionController } from '../controllers/revision.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from 'src/entities/articles.entity';
import { Revision } from 'src/entities/revision.entity';
import { User } from 'src/entities/user.entity';

@Module({
          imports: [TypeOrmModule.forFeature([Revision, User, Article])],
  
  controllers: [RevisionController],
  providers: [RevisionService],
})
export class RevisionModule {}
