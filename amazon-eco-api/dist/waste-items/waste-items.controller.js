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
exports.WasteItemsController = void 0;
const common_1 = require("@nestjs/common");
const waste_items_service_1 = require("./waste-items.service");
const create_waste_item_dto_1 = require("./dto/create-waste-item.dto");
const update_waste_item_dto_1 = require("./dto/update-waste-item.dto");
let WasteItemsController = class WasteItemsController {
    constructor(wasteItemsService) {
        this.wasteItemsService = wasteItemsService;
    }
    create(createWasteItemDto) {
        return this.wasteItemsService.create(createWasteItemDto);
    }
    findAll() {
        return this.wasteItemsService.findAll();
    }
    findOne(id) {
        return this.wasteItemsService.findOne(id);
    }
    update(id, updateWasteItemDto) {
        return this.wasteItemsService.update(id, updateWasteItemDto);
    }
    remove(id) {
        return this.wasteItemsService.remove(id);
    }
};
exports.WasteItemsController = WasteItemsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_waste_item_dto_1.CreateWasteItemDto]),
    __metadata("design:returntype", void 0)
], WasteItemsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WasteItemsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WasteItemsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_waste_item_dto_1.UpdateWasteItemDto]),
    __metadata("design:returntype", void 0)
], WasteItemsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WasteItemsController.prototype, "remove", null);
exports.WasteItemsController = WasteItemsController = __decorate([
    (0, common_1.Controller)('waste-items'),
    __metadata("design:paramtypes", [waste_items_service_1.WasteItemsService])
], WasteItemsController);
