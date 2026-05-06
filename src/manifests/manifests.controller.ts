import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ManifestsService } from './manifests.service';
import { CreateManifestDto } from './dto/create-manifest.dto';

@Controller('manifests')
export class ManifestsController {
  constructor(private readonly manifestsService: ManifestsService) {}

  @Post()
  create(@Body() createManifestDto: CreateManifestDto) {
    return this.manifestsService.create(createManifestDto);
  }

  @Get()
  findAll() {
    return this.manifestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.manifestsService.findOne(id);
  }
}