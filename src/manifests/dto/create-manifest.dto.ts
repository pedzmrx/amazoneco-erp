import { IsNotEmpty, IsString, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class ManifestItemDto {
  @IsString()
  @IsNotEmpty()
  wasteItemId!: string;

  @IsNumber()
  @IsNotEmpty()
  quantity!: number;
}

export class CreateManifestDto {
  @IsString()
  @IsNotEmpty()
  generatorId!: string;

  @IsString()
  @IsNotEmpty()
  transporterId!: string;

  @IsString()
  @IsNotEmpty()
  destinatorId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ManifestItemDto)
  items!: ManifestItemDto[];
}