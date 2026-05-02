import { IsEnum, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export enum CompanyType {
  GENERATOR = 'GENERATOR',
  TRANSPORTER = 'TRANSPORTER',
  DESTINATOR = 'DESTINATOR',
}

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  cnpj: string;

  @IsEnum(CompanyType)
  type: CompanyType;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsOptional()
  licenseNumber?: string;
}