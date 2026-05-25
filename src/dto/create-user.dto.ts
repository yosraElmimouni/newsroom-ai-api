import { IsEmail, IsString, IsEnum } from 'class-validator';
import { Roles } from 'src/enums/Roles';

export class CreateUserDto {
  @IsString()
  nom!: string;

  @IsString()
  prenom!: string;

  @IsEmail()
  email!: string;

  @IsString()
  motDePasse!: string;

  @IsEnum(Roles)
  role!: Roles;
}