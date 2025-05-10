import { Test, TestingModule } from '@nestjs/testing';
import { SalesExecutiveController } from './sales-executive.controller';

describe('SalesExecutiveController', () => {
  let controller: SalesExecutiveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalesExecutiveController],
    }).compile();

    controller = module.get<SalesExecutiveController>(SalesExecutiveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
