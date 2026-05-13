import { Test, TestingModule } from '@nestjs/testing';
import { WasteItemsController } from './waste-items.controller';
import { WasteItemsService } from './waste-items.service';

describe('WasteItemsController', () => {
  let controller: WasteItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WasteItemsController],
      providers: [WasteItemsService],
    }).compile();

    controller = module.get<WasteItemsController>(WasteItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
