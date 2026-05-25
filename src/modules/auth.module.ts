import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/role.entity';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { JwtStrategy } from '../config/jwt.strategy';
import { RolesGuard } from '../config/roles.guard';
import { UserService } from '../services/user.service'; // ← ajouter

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, Role]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret:      config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '8h' },
      }),
    }),
  ],
  providers:   [AuthService, UserService, JwtStrategy, RolesGuard], // ← UserService ajouté
  controllers: [AuthController],
  exports:     [AuthService, JwtModule],
})
export class AuthModule {}