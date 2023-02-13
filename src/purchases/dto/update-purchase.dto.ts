import { PartialType } from '@nestjs/mapped-types';
import { CreatePurchaseDto } from './create-purchase.dto';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class UpdatePurchaseDto extends PartialType(CreatePurchaseDto) {
  @IsInt()
  @IsPositive()
  @IsOptional()
  total?: number;

  @IsOptional()
  id?: string;
}
