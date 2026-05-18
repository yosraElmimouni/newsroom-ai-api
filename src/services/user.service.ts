import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const User = this.UserRepository.create(createUserDto);

    return await this.UserRepository.save(User);
  }

  async findAll() {
    return await this.UserRepository.find();
  }

  findOne(id: number) {
    return this.UserRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const User = await this.findOne(id);
    if (!User) {
      throw new NotFoundException();
    }
    Object.assign(User, updateUserDto);

    return await this.UserRepository.save(User);
  }

  async remove(id: number) {
    const User = await this.findOne(id);
    if (!User) {
      throw new NotFoundException();
    }
    return await this.UserRepository.remove(User);
  }
}
