import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateManifestoDto } from './dto/create-manifesto.dto';

@Injectable()
export class ManifestosService {
  constructor(private prisma: PrismaService) {}

  async create(createManifestoDto: CreateManifestoDto, userId: string) {
  const companyExists = await this.prisma.company.findUnique({
    where: { id: createManifestoDto.empresaPim }
  });

  if (!companyExists) {
    throw new Error('A empresa selecionada não foi encontrada no banco de dados.');
  }

  return this.prisma.manifesto.create({
    data: {
      numeroMtr: createManifestoDto.numeroMtr,
      empresa: companyExists.name,
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

  async updateStatus(id: string, status: 'EMITIDO' | 'EM_TRANSITO' | 'RECEBIDO' | 'DESTINADO') {
  return this.prisma.manifesto.update({
    where: { id },
    data: { status },
  });
}
}