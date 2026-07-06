import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateIaAnalyseDto {
  @IsInt()
  userId!: number;

  @IsString()
  @IsNotEmpty()
  question!: string;

  @IsString()
  @IsNotEmpty()
  resultat!: string;
}