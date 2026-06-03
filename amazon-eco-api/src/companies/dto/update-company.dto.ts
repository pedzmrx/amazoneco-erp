import { IsString, IsOptional } from 'class-validator';
import { IsCNPJ } from './create-company.dto';

export class UpdateCompanyDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  @IsCNPJ()
  cnpj?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  licenseNumber?: string;
}