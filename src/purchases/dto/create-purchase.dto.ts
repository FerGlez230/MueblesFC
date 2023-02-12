import { Transform, Type } from 'class-transformer';
import { IsInt, IsPositive, IsDate, IsArray, IsObject } from 'class-validator';
import { Client } from 'src/client/entities/client.entity';
import { PartialPurchase } from '../entities/partial-purchase.entity';

export class CreatePurchaseDto {
  @IsInt()
  @IsPositive()
  weeks: number;

  @Transform(({ value }) => value && new Date(value))
  @IsDate()
  date: string;

  @IsArray()
  @Type(() => PartialPurchase)
  partialPurchases: PartialPurchase[];

  @IsObject()
  client: Client;
}
