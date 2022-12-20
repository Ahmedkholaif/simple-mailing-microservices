import { Test, TestingModule } from '@nestjs/testing';
import { MailStatusService } from './mail-status.service';

describe('MailStatusService', () => {
  let service: MailStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailStatusService],
    }).compile();

    service = module.get<MailStatusService>(MailStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
