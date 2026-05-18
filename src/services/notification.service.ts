import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { UpdateNotificationDto } from '../dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const Notification = this.notificationRepository.create(
      createNotificationDto,
    );

    return await this.notificationRepository.save(Notification);
  }

  async findAll() {
    return await this.notificationRepository.find();
  }

  findOne(id: number) {
    return this.notificationRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateNotificationDto: UpdateNotificationDto) {
    const Notification = await this.findOne(id);
    if (!Notification) {
      throw new NotFoundException();
    }
    Object.assign(Notification, updateNotificationDto);

    return await this.notificationRepository.save(Notification);
  }

  async remove(id: number) {
    const Notification = await this.findOne(id);
    if (!Notification) {
      throw new NotFoundException();
    }
    return await this.notificationRepository.remove(Notification);
  }
}
