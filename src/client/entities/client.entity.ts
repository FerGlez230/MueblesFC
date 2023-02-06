import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Locations } from '../enums/location.enum';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  @IsString()
  id: string;

  @Column('text', {
    nullable: false,
  })
  @IsString()
  @MinLength(3)
  name: string;

  @Column('text', {
    nullable: false,
  })
  @IsString()
  @MinLength(3)
  lastname: string;

  @Column('text', {
    nullable: false,
  })
  @IsString()
  @IsIn(Object.values(Locations))
  location: string;

  @Column('text', {
    nullable: true,
    default: null,
  })
  @IsString()
  @IsOptional()
  description: string;
}
