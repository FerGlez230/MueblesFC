import { IsString, IsInt, IsPositive, IsNumber } from 'class-validator';
import { Product } from 'src/products/entities/product.entity';
import { Purchase } from 'src/purchases/entities/purchase.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('partialPurchases')
export class PartialPurchase {
  @PrimaryGeneratedColumn('uuid')
  @IsString()
  id: string;

  @Column('text', {
    nullable: false,
  })
  @IsInt()
  @IsPositive()
  quantity: number;

  @Column('numeric', {
    nullable: false,
  })
  @IsNumber()
  @IsPositive()
  price: number;

  @ManyToOne(() => Product, (product) => product.partialPurchase, {
    eager: true,
  })
  product: Product;

  @ManyToOne(() => Purchase, (purchase) => purchase.partialPurchase)
  purchase: Purchase;
}
