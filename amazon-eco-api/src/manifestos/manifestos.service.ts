import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateManifestoDto } from './dto/create-manifesto.dto';

@Injectable()
export class ManifestosService {
  constructor(private prisma: PrismaService) {}

  async create(createManifestoDto: CreateManifestoDto, userId: string) {
    return this.prisma.manifesto.create({
      data: {
        numeroMtr: createManifestoDto.numeroMtr,
        empresa: createManifestoDto.empresaPim,
        tipoResiduo: createManifestoDto.residuoDestinado, 
        quantidade: createManifestoDto.quantidadeToneladas, 
        status: createManifestoDto.status,
        criadoPorId: userId,
      },
    });
  }

  async findAll() {
    return this.prisma.manifesto.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}