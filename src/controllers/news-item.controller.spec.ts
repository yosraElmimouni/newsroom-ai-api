import { Test, TestingModule } from '@nestjs/testing';
import { NewsItemController } from './news-item.controller';
import { NewsItemService } from '../services/news-item.service';

describe('NewsItemController', () => {
  let controller: NewsItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewsItemController],
      providers: [NewsItemService],
    }).compile();

    controller = module.get<NewsItemController>(NewsItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
