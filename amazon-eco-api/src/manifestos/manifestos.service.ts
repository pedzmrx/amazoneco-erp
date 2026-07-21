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

  async findAll(filters?: { search?: string; status?: string }) {
    const where: any = {};

    if (filters?.status && filters.status !== 'TODOS') {
      where.status = filters.status;
    }

    if (filters?.search) {
      where.OR = [
        { numeroMtr: { contains: filters.search, mode: 'insensitive' } },
        { empresa: { contains: filters.search, mode: 'insensitive' } },
        { tipoResiduo: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.manifesto.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: 'EMITIDO' | 'EM_TRANSITO' | 'RECEBIDO' | 'DESTINADO') {
    return this.prisma.manifesto.update({
      where: { id },
      data: { status },
    });
  }

  async getMetricas() {
    const agrupado = await this.prisma.manifesto.groupBy({
      by: ['status'],
      _count: {
        id: true,
      },
      _sum: {
        quantidade: true,
      },
    });

    const metricas = {
      total: 0,
      emitido: 0,
      emTransito: 0,
      recebido: 0,
      destinado: 0,
      pesoTotal: 0,
    };

    agrupado.forEach((item) => {
      const qtd = item._count.id;
      const peso = item._sum.quantidade || 0;

      metricas.total += qtd;
      metricas.pesoTotal += peso;

      if (item.status === 'EMITIDO') metricas.emitido = qtd;
      if (item.status === 'EM_TRANSITO') metricas.emTransito = qtd;
      if (item.status === 'RECEBIDO') metricas.recebido = qtd;
      if (item.status === 'DESTINADO') metricas.destinado = qtd;
    });

    return metricas;
  }

  async getStats() {
    const agregados = await this.prisma.manifesto.aggregate({
      _sum: {
        quantidade: true,
      },
      _count: {
        id: true,
      },
    });

    const porStatus = await this.prisma.manifesto.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    const porResiduo = await this.prisma.manifesto.groupBy({
      by: ['tipoResiduo'],
      _sum: {
        quantidade: true,
      },
      orderBy: {
        _sum: {
          quantidade: 'desc',
        },
      },
      take: 5,
    });

    const totalMtrs = agregados._count?.id ?? 0;
    const tonelagemTotal = agregados._sum?.quantidade ?? 0;

    type StatusMap = Record<string, number>;
    
    const statusMap = porStatus.reduce<StatusMap>((acc, item) => {
      if (item.status) {
        acc[item.status] = item._count.status;
      }
      return acc;
    }, {});

    const emitidos = statusMap['EMITIDO'] ?? 0;
    const emTransito = statusMap['EM_TRANSITO'] ?? 0;
    const recebidos = statusMap['RECEBIDO'] ?? 0;
    const destinados = statusMap['DESTINADO'] ?? 0;
    const concluidos = recebidos + destinados;

    const taxaConformidade = totalMtrs > 0 
      ? Number(((concluidos / totalMtrs) * 100).toFixed(0)) 
      : 0;

    return {
      totalMtrs,
      tonelagemTotal: Number(tonelagemTotal.toFixed(2)),
      emitidos,
      emTransito,
      concluidos,
      taxaConformidade,
      porResiduo: porResiduo.map((item) => ({
        tipoResiduo: item.tipoResiduo,
        quantidade: Number((item._sum?.quantidade ?? 0).toFixed(2)),
      })),
    };
  }
}

