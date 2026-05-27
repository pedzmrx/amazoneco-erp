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
exports.CreateManifestoDto = exports.ManifestoStatus = void 0;
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
var ManifestoStatus;
(function (ManifestoStatus) {
    ManifestoStatus["EMITIDO"] = "Emitido";
    ManifestoStatus["EM_TRANSITO"] = "Em Tr\u00E2nsito";
    ManifestoStatus["RECEBIDO"] = "Recebido";
})(ManifestoStatus || (exports.ManifestoStatus = ManifestoStatus = {}));
class CreateManifestoDto {
}
exports.CreateManifestoDto = CreateManifestoDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O número do MTR é obrigatório.' }),
    __metadata("design:type", String)
], CreateManifestoDto.prototype, "numeroMtr", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'A empresa (PIM) é obrigatória.' }),
    __metadata("design:type", String)
], CreateManifestoDto.prototype, "empresaPim", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'O tipo de resíduo é obrigatório.' }),
    __metadata("design:type", String)
], CreateManifestoDto.prototype, "residuoDestinado", void 0);
__decorate([
    (0, class_validator_1.IsNumber)({}, { message: 'A quantidade deve ser um número válido.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'A quantidade em toneladas é obrigatória.' }),
    __metadata("design:type", Number)
], CreateManifestoDto.prototype, "quantidadeToneladas", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(ManifestoStatus, { message: 'Status inválido.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'O status do manifesto é obrigatório.' }),
    __metadata("design:type", String)
], CreateManifestoDto.prototype, "status", void 0);
