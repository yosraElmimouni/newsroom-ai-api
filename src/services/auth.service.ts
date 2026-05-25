import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { LoginDto } from '../dto/login.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { Roles } from '../enums/Roles';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    private jwtService: JwtService,
  ) {}

  // ── LOGIN ──────────────────────────────────────────────────
  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email.toLowerCase() },
      relations: ['role'],
    });

    if (!user)
      throw new UnauthorizedException('Email ou mot de passe incorrect');

    const valid = await bcrypt.compare(dto.motDePasse, user.motDePasse);
    if (!valid)
      throw new UnauthorizedException('Email ou mot de passe incorrect');

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role?.nomRole,
      nom: user.nom,
      prenom: user.prenom,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role?.nomRole,
      },
    };
  }

  // ── CRÉER UN UTILISATEUR (admin seulement) ─────────────────
  async createUser(dto: CreateUserDto) {
    dto.email = dto.email.toLowerCase();

    const existing = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Cet email est déjà utilisé');

    let role = await this.roleRepo.findOne({ where: { nomRole: dto.role } });
    if (!role) {
      role = this.roleRepo.create({ nomRole: dto.role });
      await this.roleRepo.save(role);
    }

    const hash = await bcrypt.hash(dto.motDePasse, 10);

    const user = this.userRepo.create({
      nom: dto.nom,
      prenom: dto.prenom,
      email: dto.email,
      motDePasse: hash,
      role,
    });

    const saved = await this.userRepo.save(user);
    const { motDePasse: _, ...result } = saved;
    return result;
  }

  // ── SEED ADMIN (appelé au démarrage) ───────────────────────
  async seedAdmin() {
    const adminEmail = (
      process.env.ADMIN_EMAIL || 'admin@usms.ac.ma'
    ).toLowerCase();
    const existing = await this.userRepo.findOne({
      where: { email: adminEmail },
    });
    if (existing) return;

    let role = await this.roleRepo.findOne({
      where: { nomRole: Roles.JOURNALISTE },
    });
    if (!role) {
      role = this.roleRepo.create({ nomRole: Roles.JOURNALISTE });
      await this.roleRepo.save(role);
    }

    const hash = await bcrypt.hash(
      process.env.ADMIN_PASSWORD || 'Admin@1234',
      10,
    );
    const admin = this.userRepo.create({
      nom: 'Admin',
      prenom: 'Système',
      email: adminEmail,
      motDePasse: hash,
      role,
    });
    await this.userRepo.save(admin);
    console.log(` Admin créé : ${adminEmail}`);
  }
  // src/services/auth.service.ts — ajouter cette méthode
  async generateToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role?.nomRole,
      nom: user.nom,
      prenom: user.prenom,
    };
    return this.jwtService.sign(payload);
  }
}
