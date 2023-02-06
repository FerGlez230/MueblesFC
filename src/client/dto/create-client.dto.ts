import { IsString, MinLength, IsIn, IsOptional } from 'class-validator';
import { Locations } from '../enums/location.enum';

export class CreateClientDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(3)
  lastname: string;

  @IsString()
  @IsIn(Object.values(Locations))
  location: string;

  @IsString()
  @IsOptional()
  description: string;
}
