import { IsEnum } from 'class-validator';

export class UpdateManifestoStatusDto {
  @IsEnum(['EMITIDO', 'EM_TRANSITO', 'RECEBIDO', 'DESTINADO'], {
    message: 'O status deve ser EMITIDO, EM_TRANSITO, RECEBIDO ou DESTINADO',
  })
  status!: 'EMITIDO' | 'EM_TRANSITO' | 'RECEBIDO' | 'DESTINADO';
}