import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateManifestDto } from './dto/create-manifest.dto';

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
            wasteItem: { connect: { id: item.wasteItemId } },
            quantity: item.quantity,
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

  async findAll() {
    return this.prisma.manifest.findMany({
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

  async findOne(id: string) {
    return this.prisma.manifest.findUnique({
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
  }
}