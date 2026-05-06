import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WasteItemsService } from './waste-items.service';
import { CreateWasteItemDto } from './dto/create-waste-item.dto';
import { UpdateWasteItemDto } from './dto/update-waste-item.dto';

@Controller('waste-items')
export class WasteItemsController {
  constructor(private readonly wasteItemsService: WasteItemsService) {}

  @Post()
  create(@Body() createWasteItemDto: CreateWasteItemDto) {
    return this.wasteItemsService.create(createWasteItemDto);
  }

  @Get()
  findAll() {
    return this.wasteItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wasteItemsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWasteItemDto: UpdateWasteItemDto) {
    return this.wasteItemsService.update(id, updateWasteItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wasteItemsService.remove(id);
  }
}