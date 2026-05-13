"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateWasteItemDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_waste_item_dto_1 = require("./create-waste-item.dto");
class UpdateWasteItemDto extends (0, mapped_types_1.PartialType)(create_waste_item_dto_1.CreateWasteItemDto) {
}
exports.UpdateWasteItemDto = UpdateWasteItemDto;
