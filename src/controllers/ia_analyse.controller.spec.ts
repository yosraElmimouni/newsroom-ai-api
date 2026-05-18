import { Test, TestingModule } from '@nestjs/testing';
import { IaAnalyseController } from './ia_analyse.controller';
import { IaAnalyseService } from './../services/ia_analyse.service';

describe('IaAnalyseController', () => {
  let controller: IaAnalyseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IaAnalyseController],
      providers: [IaAnalyseService],
    }).compile();

    controller = module.get<IaAnalyseController>(IaAnalyseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
