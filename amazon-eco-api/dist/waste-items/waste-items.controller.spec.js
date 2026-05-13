"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const waste_items_controller_1 = require("./waste-items.controller");
const waste_items_service_1 = require("./waste-items.service");
describe('WasteItemsController', () => {
    let controller;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [waste_items_controller_1.WasteItemsController],
            providers: [waste_items_service_1.WasteItemsService],
        }).compile();
        controller = module.get(waste_items_controller_1.WasteItemsController);
    });
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
