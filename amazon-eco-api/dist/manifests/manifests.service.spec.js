"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const manifests_service_1 = require("./manifests.service");
describe('ManifestsService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [manifests_service_1.ManifestsService],
        }).compile();
        service = module.get(manifests_service_1.ManifestsService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
