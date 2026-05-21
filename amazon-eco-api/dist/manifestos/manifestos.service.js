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
    async findOne(id) {
        const manifesto = await this.prisma.manifesto.findUnique({
            where: { id },
        });
        if (!manifesto) {
            throw new common_1.NotFoundException('Manifesto não encontrado');
        }
        return manifesto;
    }
};
exports.ManifestosService = ManifestosService;
exports.ManifestosService = ManifestosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ManifestosService);
