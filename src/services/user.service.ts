import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/entities/role.entity';
import { Roles } from 'src/enums/Roles';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly UserRepository: Repository<User>,
  ) {}

  async findOrCreateByEmail(email: string, nom?: string, prenom?: string) {
    const normalized = email.toLowerCase();

    // Chercher l'user existant
    let user = await this.UserRepository.findOne({
      where: { email: normalized },
      relations: ['role'],
    });

    // S'il n'existe pas → le créer avec rôle JOURNALISTE par défaut
    if (!user) {
      // Récupérer ou créer le rôle JOURNALISTE
      const roleRepo = this.UserRepository.manager.getRepository('Role');
      let role = await roleRepo.findOne({ where: { nomRole: 'ADMIN' } });
      if (!role) {
        role = roleRepo.create({ nomRole: 'ADMIN' });
        await roleRepo.save(role);
      }

      user = this.UserRepository.create({
        email: normalized,
        nom: nom || normalized.split('@')[0],
        prenom: prenom || '',
        motDePasse: '', // pas de mot de passe pour les users MSAL
        role,
      });
      await this.UserRepository.save(user);

      // Recharger avec la relation role
      user = await this.UserRepository.findOne({
        where: { email: normalized },
        relations: ['role'],
      });
    }

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    // 1. Résoudre l'entité Role depuis l'enum string
    const roleRepo = this.UserRepository.manager.getRepository(Role);
    const role = await roleRepo.findOne({
      where: { nomRole: createUserDto.role },
    });
    if (!role)
      throw new NotFoundException(`Rôle "${createUserDto.role}" introuvable`);

    // 2. Créer l'user avec l'entité Role résolue
    const user = this.UserRepository.create({
      nom: createUserDto.nom,
      prenom: createUserDto.prenom,
      email: createUserDto.email.toLowerCase(),
      motDePasse: createUserDto.motDePasse,
      role,
    });

    return await this.UserRepository.save(user);
  }

  async findAll() {
    return await this.UserRepository.find();
  }
findOne(id: number) {
  return this.UserRepository.findOne({
    where: { id },
    relations: ['role'],  
  });
}

  async update(id: number, updateUserDto: UpdateUserDto) {
  const user = await this.UserRepository.findOne({
    where: { id },
    relations: ['role'],
  });
  if (!user) throw new NotFoundException();

  // Champs simples
  if (updateUserDto.nom)     user.nom     = updateUserDto.nom;
  if (updateUserDto.prenom)  user.prenom  = updateUserDto.prenom;
  if (updateUserDto.email)   user.email   = updateUserDto.email.toLowerCase();
  if (updateUserDto.motDePasse) user.motDePasse = updateUserDto.motDePasse;

  // Rôle : résoudre l'entité Role depuis le string
  if (updateUserDto.role) {
    const roleRepo = this.UserRepository.manager.getRepository(Role);
    const role = await roleRepo.findOne({
      where: { nomRole: updateUserDto.role as unknown as Roles },
    });
    if (!role) throw new NotFoundException(`Rôle "${updateUserDto.role}" introuvable`);
    user.role = role;
  }

  return await this.UserRepository.save(user);
}
  async remove(id: number) {
    const User = await this.findOne(id);
    if (!User) {
      throw new NotFoundException();
    }
    return await this.UserRepository.remove(User);
  }


  async countByRole(roleName: Roles): Promise<number> {
    return await this.UserRepository.count({
      where: { role: { nomRole: roleName } },
      relations: ['role'], 
    });
  }

  async findUsersByRole(roleName: Roles): Promise<User[]> {
    return await this.UserRepository.find({
      where: { role: { nomRole: roleName } },
      relations: ['role'], 
    });
  }
}
