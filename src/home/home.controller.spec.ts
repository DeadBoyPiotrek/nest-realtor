import { Test, TestingModule } from '@nestjs/testing';
import { HomeController } from './home.controller';
import { HomeModule } from './home.module';

describe('HomeController', () => {
  let controller: HomeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeController],
      imports: [HomeModule],
    }).compile();

    controller = module.get<HomeController>(HomeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
