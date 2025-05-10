import { Test, TestingModule } from '@nestjs/testing';
import { SalesExecutiveService } from './sales-executive.service';

describe('SalesExecutiveService', () => {
  let service: SalesExecutiveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalesExecutiveService],
    }).compile();

    service = module.get<SalesExecutiveService>(SalesExecutiveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
