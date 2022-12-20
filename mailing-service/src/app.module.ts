import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
    MailerModule.forRoot({
      transport: {
        host: 'smtp.sendgrid.net',
        auth: {
          user: 'apikey',
          pass: process.env.SMTP_API_KEY,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
