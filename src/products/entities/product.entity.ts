import {
  IsIn,
  IsNumber,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Categories } from '../enums/categories.enum';
import { PartialPurchase } from 'src/purchases/entities/partial-purchase.entity';
@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsString()
  @MinLength(3)
  name: string;

  @Column()
  @IsString()
  @MinLength(3)
  @IsIn(Object.values(Categories))
  category: string;

  @Column()
  @IsNumber()
  @IsPositive()
  price: number;

  @OneToMany(
    () => PartialPurchase,
    (partialPurchase) => partialPurchase.product,
    {},
  )
  partialPurchase: PartialPurchase[];
}
