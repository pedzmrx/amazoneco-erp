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
exports.WasteItemsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let WasteItemsService = class WasteItemsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createWasteItemDto) {
        return this.prisma.wasteItem.create({
            data: createWasteItemDto,
        });
    }
    async findAll() {
        return this.prisma.wasteItem.findMany();
    }
    async findOne(id) {
        return this.prisma.wasteItem.findUnique({
            where: { id },
        });
    }
    async update(id, updateWasteItemDto) {
        return this.prisma.wasteItem.update({
            where: { id },
            data: updateWasteItemDto,
        });
    }
    async remove(id) {
        return this.prisma.wasteItem.delete({
            where: { id },
        });
    }
};
exports.WasteItemsService = WasteItemsService;
exports.WasteItemsService = WasteItemsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WasteItemsService);
