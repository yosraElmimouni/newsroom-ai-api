import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'Article' })
export class Article {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: 'text',
        nullable: false
    })
    title!: string;
}