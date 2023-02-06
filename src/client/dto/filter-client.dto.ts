import { IsIn, IsOptional, IsString } from 'class-validator';
import { Locations } from '../enums/location.enum';

export class FilterClientDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  lastname: string;

  @IsString()
  @IsOptional()
  @IsIn(Object.values(Locations))
  location: string;
}
