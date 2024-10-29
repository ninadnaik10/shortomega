import { Test, TestingModule } from '@nestjs/testing';
import { ShortenerController } from './shortener.controller';

describe('ShortenerController', () => {
  let controller: ShortenerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShortenerController],
    }).compile();

    controller = module.get<ShortenerController>(ShortenerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
