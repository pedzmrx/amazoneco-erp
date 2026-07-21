import { Controller, Get, Post, Body, UseGuards, Req, Patch, Param, Query } from '@nestjs/common';
import { ManifestosService } from './manifestos.service';
import { CreateManifestoDto } from './dto/create-manifesto.dto';
import { AuthGuard } from '@nestjs/passport';
import { IsEnum } from 'class-validator';

class UpdateManifestoStatusDto {
  @IsEnum(['EMITIDO', 'EM_TRANSITO', 'RECEBIDO', 'DESTINADO'], {
    message: 'O status deve ser EMITIDO, EM_TRANSITO, RECEBIDO ou DESTINADO',
  })
  status!: 'EMITIDO' | 'EM_TRANSITO' | 'RECEBIDO' | 'DESTINADO';
}

@Controller('manifestos')
@UseGuards(AuthGuard('jwt'))
export class ManifestosController {
  constructor(private readonly manifestosService: ManifestosService) {}

  @Post()
  async create(@Body() createManifestoDto: CreateManifestoDto, @Req() req: any) {
    console.log('CONTEÚDO DO REQ.USER:', req.user);
    const userId = req.user?.id || req.user?.sub || req.user?.userId || req.user?.user?.id;

    if (!userId) {
      throw new Error('Não foi possível identificar o ID do usuário logado no token JWT.');
    }
    
    return this.manifestosService.create(createManifestoDto, userId);
  }

  @Get()
  async findAll(
    @Query('search') search?: string, 
    @Query('status') status?: string, 
  ) {
    return this.manifestosService.findAll({ search, status });
  }

  @Get('stats')
  async getStats() {
    return this.manifestosService.getStats();
  }

  @Get('metricas')
  async getMetricas() {
    return this.manifestosService.getMetricas();
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateManifestoStatusDto,
  ) {
    return this.manifestosService.updateStatus(id, updateStatusDto.status);
  }
}