"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateManifestDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_manifest_dto_1 = require("./create-manifest.dto");
class UpdateManifestDto extends (0, mapped_types_1.PartialType)(create_manifest_dto_1.CreateManifestDto) {
}
exports.UpdateManifestDto = UpdateManifestDto;
