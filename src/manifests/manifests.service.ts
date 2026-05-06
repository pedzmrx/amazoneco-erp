import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateManifestDto } from './dto/create-manifest.dto';
import { FindManifestsQueryDto } from './dto/find-manifests-query.dto';

@Injectable()
export class ManifestsService {
  constructor(private prisma: PrismaService) {}

  async create(createManifestDto: CreateManifestDto) {
    const { generatorId, transporterId, destinatorId, items } = createManifestDto;

    return this.prisma.manifest.create({
      data: {
        generator: { connect: { id: generatorId } },
        transporter: { connect: { id: transporterId } },
        destinator: { connect: { id: destinatorId } },
        items: {
          create: items.map((item) => ({
            quantity: item.quantity,
            wasteItem: { connect: { id: item.wasteItemId } },
          })),
        },
      },
      include: {
        generator: true,
        transporter: true,
        destinator: true,
        items: {
          include: { wasteItem: true },
        },
      },
    });
  }

  async findAll(query: FindManifestsQueryDto) {
  const { status, companyId, startDate, endDate } = query;

  return this.prisma.manifest.findMany({
    where: {
      ...(status && { status }),
      ...(companyId && {
        OR: [
          { generatorId: companyId },
          { transporterId: companyId },
          { destinatorId: companyId },
        ],
      }),
      ...((startDate || endDate) && {
        issuedAt: {
          ...(startDate && { gte: new Date(startDate) }), 
          ...(endDate && { lte: new Date(endDate) }),
        },
      }),
    },
    include: {
      generator: true,
      transporter: true,
      destinator: true,
      items: { include: { wasteItem: true } },
    },
    orderBy: { issuedAt: 'desc' },
  });
}

  async findOne(id: string) {
    const manifest = await this.prisma.manifest.findUnique({
      where: { id },
      include: {
        generator: true,
        transporter: true,
        destinator: true,
        items: {
          include: { wasteItem: true },
        },
      },
    });

    if (!manifest) throw new NotFoundException('Manifesto não encontrado');
    return manifest;
  }

  async complete(id: string) {
    const manifest = await this.findOne(id);

    if (manifest.status === 'COMPLETED') {
      throw new BadRequestException('Este manifesto já foi finalizado anteriormente.');
    }

    return this.prisma.manifest.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
      include: {
        generator: true,
        transporter: true,
        destinator: true,
        items: {
          include: { wasteItem: true },
        },
      },
    });
  }
}