import { Test, TestingModule } from '@nestjs/testing';
import { IaAnalyseService } from '../services/ia_analyse.service';

describe('IaAnalyseService', () => {
  let service: IaAnalyseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IaAnalyseService],
    }).compile();

    service = module.get<IaAnalyseService>(IaAnalyseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
