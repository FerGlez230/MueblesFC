import { IsDate, IsNumber, IsUUID } from 'class-validator';
import { Purchase } from 'src/purchases/entities';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Column('date')
  @IsDate()
  date;

  @Column()
  @IsNumber()
  amount: number;

  @ManyToOne(() => Purchase, (purchase) => purchase.payments, {
    onDelete: 'CASCADE',
  })
  purchase: Purchase;
}
