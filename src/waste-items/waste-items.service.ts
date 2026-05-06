import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWasteItemDto } from './dto/create-waste-item.dto';
import { UpdateWasteItemDto } from './dto/update-waste-item.dto';

@Injectable() 
export class WasteItemsService {
  constructor(private prisma: PrismaService) {}

  async create(createWasteItemDto: CreateWasteItemDto) {
    return this.prisma.wasteItem.create({
      data: createWasteItemDto,
    });
  }

  async findAll() {
    return this.prisma.wasteItem.findMany();
  }

  async findOne(id: string) {
    return this.prisma.wasteItem.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateWasteItemDto: UpdateWasteItemDto) {
    return this.prisma.wasteItem.update({
      where: { id },
      data: updateWasteItemDto,
    });
  }

  async remove(id: string) {
    return this.prisma.wasteItem.delete({
      where: { id },
    });
  }
}