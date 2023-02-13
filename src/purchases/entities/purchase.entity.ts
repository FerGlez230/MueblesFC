import { IsDate, IsInt, IsObject, IsPositive, IsString } from 'class-validator';
import { Client } from 'src/client/entities/client.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PartialPurchase } from './partial-purchase.entity';

@Entity('purchases')
export class Purchase {
  @PrimaryGeneratedColumn('uuid')
  @IsString()
  id: string;

  @Column('text', {
    nullable: false,
  })
  @IsInt()
  @IsPositive()
  weeks: number;

  @Column('text', {
    nullable: false,
  })
  @IsInt()
  @IsPositive()
  total: number;

  @Column('date', {
    nullable: false,
  })
  @IsDate()
  date: string;

  @IsObject()
  @OneToMany(
    () => PartialPurchase,
    (partialPurchase) => partialPurchase.purchase,
    {
      eager: true,
      cascade: true,
    },
  )
  partialPurchases: PartialPurchase[];

  @ManyToOne(() => Client, (client) => client.purchase, {
    eager: true,
  })
  client: Client;
}
