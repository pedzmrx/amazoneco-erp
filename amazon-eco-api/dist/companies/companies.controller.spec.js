"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const companies_controller_1 = require("./companies.controller");
const companies_service_1 = require("./companies.service");
describe('CompaniesController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [companies_controller_1.CompaniesController],
            providers: [companies_service_1.CompaniesService],
        }).compile();
        controller = module.get(companies_controller_1.CompaniesController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
