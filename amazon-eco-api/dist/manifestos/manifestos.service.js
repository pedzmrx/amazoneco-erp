"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManifestosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ManifestosService = class ManifestosService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createManifestoDto, userId) {
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
    async findAll(filters) {
        const where = {};
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
    async updateStatus(id, status) {
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
            if (item.status === 'EMITIDO')
                metricas.emitido = qtd;
            if (item.status === 'EM_TRANSITO')
                metricas.emTransito = qtd;
            if (item.status === 'RECEBIDO')
                metricas.recebido = qtd;
            if (item.status === 'DESTINADO')
                metricas.destinado = qtd;
        });
        return metricas;
    }
};
exports.ManifestosService = ManifestosService;
exports.ManifestosService = ManifestosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ManifestosService);
