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
exports.CreateWasteItemDto = exports.WasteClass = void 0;
const class_validator_1 = require("class-validator");
var WasteClass;
(function (WasteClass) {
    WasteClass["I"] = "I";
    WasteClass["IIA"] = "IIA";
    WasteClass["IIB"] = "IIB";
})(WasteClass || (exports.WasteClass = WasteClass = {}));
class CreateWasteItemDto {
}
exports.CreateWasteItemDto = CreateWasteItemDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateWasteItemDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(WasteClass),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateWasteItemDto.prototype, "class", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateWasteItemDto.prototype, "unit", void 0);
