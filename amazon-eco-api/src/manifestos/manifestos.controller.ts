import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ManifestosService } from './manifestos.service';
import { CreateManifestoDto } from './dto/create-manifesto.dto';
import { AuthGuard } from '@nestjs/passport';

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
  async findAll() {
    return this.manifestosService.findAll();
  }
}