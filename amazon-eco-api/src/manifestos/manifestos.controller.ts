import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ManifestosService } from './manifestos.service';
import { AuthGuard } from '@nestjs/passport'; 

@Controller('manifestos')
export class ManifestosController {
  constructor(private readonly manifestosService: ManifestosService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createManifestoDto: any, @Request() req: any) {
    const userId = req.user.userId;
    return this.manifestosService.create(createManifestoDto, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll() {
    return this.manifestosService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.manifestosService.findOne(id);
  }
}