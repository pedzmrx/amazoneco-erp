import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

export enum WasteClass {
  I = 'I',
  IIA = 'IIA',
  IIB = 'IIB',
}

export class CreateWasteItemDto {
  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsEnum(WasteClass)
  @IsNotEmpty()
  class!: WasteClass;

  @IsString()
  @IsNotEmpty()
  unit!: string;
}