import { Test, TestingModule } from '@nestjs/testing';
import { NewsItemService } from './news-item.service';

describe('NewsItemService', () => {
  let service: NewsItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewsItemService],
    }).compile();

    service = module.get<NewsItemService>(NewsItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
