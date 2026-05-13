"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const companies_service_1 = require("./companies.service");
describe('CompaniesService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [companies_service_1.CompaniesService],
        }).compile();
        service = module.get(companies_service_1.CompaniesService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
