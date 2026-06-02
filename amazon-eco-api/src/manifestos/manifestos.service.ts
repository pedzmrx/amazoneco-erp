import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateManifestoDto } from './dto/create-manifesto.dto';
import { ManifestStatus } from '@prisma/client';

@Injectable()
export class ManifestosService {
  constructor(private prisma: PrismaService) {}

  async create(createManifestoDto: CreateManifestoDto, userId: string) {
    const companyExists = await this.prisma.company.findUnique({
      where: { id: createManifestoDto.empresaPim },
    });

    if (!companyExists) {
      throw new BadRequestException('A empresa selecionada não foi encontrada no banco de dados.');
    }

    let wasteItem = await this.prisma.wasteItem.findFirst({
      where: { description: createManifestoDto.residuoDestinado },
    });

    if (!wasteItem) {
      wasteItem = await this.prisma.wasteItem.create({
        data: { 
          description: createManifestoDto.residuoDestinado,
          class: 'I',          
          unit: 'TONELADAS',   
        },
      });
    }

    return this.prisma.manifest.create({
      data: {
        status: ManifestStatus.PENDING, 
        generatorId: companyExists.id,
        transporterId: companyExists.id,
        destinatorId: companyExists.id,
        items: {
          create: {
            quantity: createManifestoDto.quantidadeToneladas,
            wasteItemId: wasteItem.id,
          },
        },
      },
      include: {
        generator: true,
        items: {
          include: {
            wasteItem: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.manifest.findMany({
      orderBy: { issuedAt: 'desc' },
      include: {
        generator: true,
        items: {
          include: {
            wasteItem: true,
          },
        },
      },
    });
  }
}