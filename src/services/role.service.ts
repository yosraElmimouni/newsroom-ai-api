import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly RoleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const Role = this.RoleRepository.create(createRoleDto);

    return await this.RoleRepository.save(Role);
  }

  async findAll() {
    return await this.RoleRepository.find();
  }

  findOne(id: number) {
    return this.RoleRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const Role = await this.findOne(id);
    if (!Role) {
      throw new NotFoundException();
    }
    Object.assign(Role, updateRoleDto);

    return await this.RoleRepository.save(Role);
  }

  async remove(id: number) {
    const Role = await this.findOne(id);
    if (!Role) {
      throw new NotFoundException();
    }
    return await this.RoleRepository.remove(Role);
  }
}
