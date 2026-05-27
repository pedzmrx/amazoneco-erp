import { IsNotEmpty, IsNumber, IsString, IsEnum } from 'class-validator';
import { StatusManifesto } from '@prisma/client';

export enum ManifestoStatus {
  EMITIDO = 'Emitido',
  EM_TRANSITO = 'Em Trânsito',
  RECEBIDO = 'Recebido',
}

export class CreateManifestoDto {
  @IsString()
  @IsNotEmpty({ message: 'O número do MTR é obrigatório.' })
  numeroMtr!: string; 

  @IsString()
  @IsNotEmpty({ message: 'A empresa (PIM) é obrigatória.' })
  empresaPim!: string; 

  @IsString()
  @IsNotEmpty({ message: 'O tipo de resíduo é obrigatório.' })
  residuoDestinado!: string;

  @IsNumber({}, { message: 'A quantidade deve ser um número válido.' })
  @IsNotEmpty({ message: 'A quantidade em toneladas é obrigatória.' })
  quantidadeToneladas!: number; 

  @IsEnum(ManifestoStatus, { message: 'Status inválido.' })
  @IsNotEmpty({ message: 'O status do manifesto é obrigatório.' })
  status!: StatusManifesto;
}