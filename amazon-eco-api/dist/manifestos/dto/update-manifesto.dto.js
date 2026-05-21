"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateManifestoDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_manifesto_dto_1 = require("./create-manifesto.dto");
class UpdateManifestoDto extends (0, mapped_types_1.PartialType)(create_manifesto_dto_1.CreateManifestoDto) {
}
exports.UpdateManifestoDto = UpdateManifestoDto;
