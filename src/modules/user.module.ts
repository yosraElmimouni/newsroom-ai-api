import { Module } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserController } from '../controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from 'src/entities/articles.entity';
import { IAAnalyse } from 'src/entities/ia_analyse.entity';
import { Media } from 'src/entities/media.entity';
import { Revision } from 'src/entities/revision.entity';
import { Role } from 'src/entities/role.entity';
import { User } from 'src/entities/user.entity';
import { Notification } from 'src/entities/notification.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      Notification,
      Revision,
      Article,
      Media,
      IAAnalyse,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
