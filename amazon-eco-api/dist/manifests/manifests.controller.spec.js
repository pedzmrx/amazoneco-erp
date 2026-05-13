"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const manifests_controller_1 = require("./manifests.controller");
const manifests_service_1 = require("./manifests.service");
describe('ManifestsController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [manifests_controller_1.ManifestsController],
            providers: [manifests_service_1.ManifestsService],
        }).compile();
        controller = module.get(manifests_controller_1.ManifestsController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
