import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailStatusController } from './mail-status.controller';
import { MailStatusService } from './mail-status.service';
import { MailStatus } from './entities/mail-status.entity';
import { RabbitMQModule as rbmq } from '@golevelup/nestjs-rabbitmq';

@Module({
  imports: [
    rbmq.forRoot(rbmq, {
      exchanges: [],
      prefetchCount: 1,
      uri: process.env.RABBITMQ_URI,
      enableControllerDiscovery: true,
      connectionInitOptions: { wait: false },
    }),
    TypeOrmModule.forFeature([MailStatus]),
  ],
  controllers: [MailStatusController],
  providers: [MailStatusService],
  exports: [],
})
export class MailStatusModule {}
