import { IsOptional, IsEnum, IsString, IsISO8601 } from 'class-validator';

export enum ManifestStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

export class FindManifestsQueryDto {
  @IsOptional()
  @IsEnum(ManifestStatus, { message: 'Status inválido. Use PENDING ou COMPLETED' })
  status?: ManifestStatus;

  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  @IsISO8601({}, { message: 'A data inicial deve estar no formato YYYY-MM-DD' })
  startDate?: string;

  @IsOptional()
  @IsISO8601({}, { message: 'A data final deve estar no formato YYYY-MM-DD' })
  endDate?: string;
}