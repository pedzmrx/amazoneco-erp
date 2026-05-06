import { Controller, Get, Post, Body, Param, Patch, UseGuards, Query } from '@nestjs/common';
import { FindManifestsQueryDto } from './dto/find-manifests-query.dto';
import { ManifestsService } from './manifests.service';
import { CreateManifestDto } from './dto/create-manifest.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('manifests')
@UseGuards(AuthGuard('jwt'))
export class ManifestsController {
  constructor(private readonly manifestsService: ManifestsService) {}

  @Post()
  create(@Body() createManifestDto: CreateManifestDto) {
    return this.manifestsService.create(createManifestDto);
  }

  @Get()
  findAll(@Query() query: FindManifestsQueryDto) {
    return this.manifestsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.manifestsService.findOne(id);
  }

  @Patch(':id/complete')
  complete(@Param('id') id: string) {
    return this.manifestsService.complete(id);
  }
}