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
exports.ManifestsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ManifestsService = class ManifestsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createManifestDto) {
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
    async findAll(query) {
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
    async findOne(id) {
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
        if (!manifest)
            throw new common_1.NotFoundException('Manifesto não encontrado');
        return manifest;
    }
    async complete(id) {
        const manifest = await this.findOne(id);
        if (manifest.status === 'COMPLETED') {
            throw new common_1.BadRequestException('Este manifesto já foi finalizado anteriormente.');
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
};
exports.ManifestsService = ManifestsService;
exports.ManifestsService = ManifestsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ManifestsService);
