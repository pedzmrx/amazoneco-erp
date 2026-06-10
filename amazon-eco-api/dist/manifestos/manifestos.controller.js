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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManifestosController = void 0;
const common_1 = require("@nestjs/common");
const manifestos_service_1 = require("./manifestos.service");
const create_manifesto_dto_1 = require("./dto/create-manifesto.dto");
const passport_1 = require("@nestjs/passport");
const class_validator_1 = require("class-validator");
class UpdateManifestoStatusDto {
}
__decorate([
    (0, class_validator_1.IsEnum)(['EMITIDO', 'EM_TRANSITO', 'RECEBIDO', 'DESTINADO'], {
        message: 'O status deve ser EMITIDO, EM_TRANSITO, RECEBIDO ou DESTINADO',
    }),
    __metadata("design:type", String)
], UpdateManifestoStatusDto.prototype, "status", void 0);
let ManifestosController = class ManifestosController {
    constructor(manifestosService) {
        this.manifestosService = manifestosService;
    }
    async create(createManifestoDto, req) {
        console.log('CONTEÚDO DO REQ.USER:', req.user);
        const userId = req.user?.id || req.user?.sub || req.user?.userId || req.user?.user?.id;
        if (!userId) {
            throw new Error('Não foi possível identificar o ID do usuário logado no token JWT.');
        }
        return this.manifestosService.create(createManifestoDto, userId);
    }
    async findAll() {
        return this.manifestosService.findAll();
    }
    async updateStatus(id, updateStatusDto) {
        return this.manifestosService.updateStatus(id, updateStatusDto.status);
    }
    async getMetricas() {
        return this.manifestosService.getMetricas();
    }
};
exports.ManifestosController = ManifestosController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_manifesto_dto_1.CreateManifestoDto, Object]),
    __metadata("design:returntype", Promise)
], ManifestosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ManifestosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateManifestoStatusDto]),
    __metadata("design:returntype", Promise)
], ManifestosController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)('metricas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ManifestosController.prototype, "getMetricas", null);
exports.ManifestosController = ManifestosController = __decorate([
    (0, common_1.Controller)('manifestos'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    __metadata("design:paramtypes", [manifestos_service_1.ManifestosService])
], ManifestosController);
