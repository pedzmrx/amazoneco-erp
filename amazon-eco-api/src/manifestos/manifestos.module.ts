import { Module } from '@nestjs/common';
import { ManifestosService } from './manifestos.service';
import { ManifestosController } from './manifestos.controller';

@Module({
  controllers: [ManifestosController],
  providers: [ManifestosService],
})
export class ManifestosModule {}
