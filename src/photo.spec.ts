import { Test, TestingModule } from '@nestjs/testing';
import { Photo } from './photo';

describe('Photo', () => {
  let provider: Photo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Photo],
    }).compile();

    provider = module.get<Photo>(Photo);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
