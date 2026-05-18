import { Module } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { NotificationController } from '../controllers/notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Notification } from 'src/entities/notification.entity';
@Module({
        imports: [TypeOrmModule.forFeature([Notification, User])],
  
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
