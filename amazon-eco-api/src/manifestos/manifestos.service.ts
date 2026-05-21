import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ManifestosService {
  constructor(private prisma: PrismaService) {}

  async create(createManifestoDto: any, userId: string) {
    const numeroMtr = `MTR-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    return this.prisma.manifesto.create({
      data: {
        numeroMtr,
        empresa: createManifestoDto.empresa,
        tipoResiduo: createManifestoDto.tipoResiduo,
        quantidade: Number(createManifestoDto.quantidade),
        criadoPorId: userId,
      },
    });
  }

  async findAll() {
    return this.prisma.manifesto.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        criadoPor: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const manifesto = await this.prisma.manifesto.findUnique({
      where: { id },
    });

    if (!manifesto) {
      throw new NotFoundException('Manifesto não encontrado');
    }

    return manifesto;
  }
}