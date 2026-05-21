import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ManifestosService } from './manifestos.service';
import { CreateManifestoDto } from './dto/create-manifesto.dto';
import { UpdateManifestoDto } from './dto/update-manifesto.dto';

@Controller('manifestos')
export class ManifestosController {
  constructor(private readonly manifestosService: ManifestosService) {}

  @Post()
  create(@Body() createManifestoDto: CreateManifestoDto) {
    return this.manifestosService.create(createManifestoDto);
  }

  @Get()
  findAll() {
    return this.manifestosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.manifestosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateManifestoDto: UpdateManifestoDto) {
    return this.manifestosService.update(+id, updateManifestoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.manifestosService.remove(+id);
  }
}
