import { Transform } from 'class-transformer';
import { IsInt, IsPositive, IsDate, IsObject } from 'class-validator';
import { Purchase } from 'src/purchases/entities';

export class CreatePaymentDto {
  @IsInt()
  @IsPositive()
  amount: number;

  @Transform(({ value }) => value && new Date(value))
  @IsDate()
  date: string;

  @IsObject()
  purchase: Purchase;
}
