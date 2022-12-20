import { Test, TestingModule } from '@nestjs/testing';
import { MailStatusController } from './mail-status.controller';

describe('MailStatusController', () => {
  let controller: MailStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailStatusController],
    }).compile();

    controller = module.get<MailStatusController>(MailStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
