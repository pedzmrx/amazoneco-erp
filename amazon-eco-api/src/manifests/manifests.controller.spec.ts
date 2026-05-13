import { Test, TestingModule } from '@nestjs/testing';
import { ManifestsController } from './manifests.controller';
import { ManifestsService } from './manifests.service';

describe('ManifestsController', () => {
  let controller: ManifestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManifestsController],
      providers: [ManifestsService],
    }).compile();

    controller = module.get<ManifestsController>(ManifestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
