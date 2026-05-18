import { PartialType } from '@nestjs/mapped-types';
import { CreateIaAnalyseDto } from './create-ia_analyse.dto';

export class UpdateIaAnalyseDto extends PartialType(CreateIaAnalyseDto) {}
