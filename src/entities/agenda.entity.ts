import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import {TypeEvenement} from '../enums/TypeEvenement'
import {Importance} from '../enums/Importance'

import { Source } from './source.entity'

@Entity('agendas')
export class Agenda {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  titre!: string;

  @Column('text')
  resume!: string;

  @Column()
  categorie!: TypeEvenement;

  @Column()
  importance!: Importance;

  @Column()
  dateDebut!: Date;

  @Column()
  dateFin!: Date;

  @Column()
  lieu!: string;

  @ManyToOne(() => Source)
  source!: Source;

  
}