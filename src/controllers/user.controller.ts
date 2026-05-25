import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { RolesGuard, RequireRoles } from '../config/roles.guard';
import { Roles } from '../enums/Roles';
import { AuthService } from 'src/services/auth.service';
import { Role } from 'src/entities/role.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly authService: AuthService,  
  ) {}

 @Get('by-email/:email')
findByEmail(@Param('email') email: string) {
  return this.userService.findOrCreateByEmail(email);
}

// Ajouter cette route EN PREMIER dans le controller (avant by-email et :id)
@Post('msal-login')
async msalLogin(@Body() body: { email: string; nom?: string; prenom?: string }) {
  const user = await this.userService.findOrCreateByEmail(body.email, body.nom, body.prenom);

  if (!user) throw new NotFoundException('Utilisateur introuvable après création');  // ← garde

  const token = await this.authService.generateToken(user);

  return {
    access_token: token,
    user: {
      id:     user.id,
      nom:    user.nom,
      prenom: user.prenom,
      email:  user.email,
      role:   user.role?.nomRole ?? user.role,
    },
  };
}


  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @RequireRoles(Roles.ADMIN)
  findAll() {
    return this.userService.findAll();
  }


  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @RequireRoles(Roles.ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @RequireRoles(Roles.ADMIN)
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Get('count-by-role/:role')
  async countByRole(@Param('role') role: Roles) {
    return this.userService.countByRole(role);
  }

  @Get('users-by-role/:role')
  async findUsersByRole(@Param('role') role: Roles) {
    return this.userService.findUsersByRole(role);
  }
}