import { MailerService } from '@nestjs-modules/mailer';
import { Controller, Get } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { ConsumeMessage } from 'amqplib';
import {
  AmqpConnection,
  Nack,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private mailService: MailerService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @RabbitSubscribe({
    exchange: '',
    routingKey: '',
    queue: process.env.RABBIT_Q_NAME,
  })
  public async handleSendEmail(msg: any, amqpMsg: ConsumeMessage) {
    try {
      if (process.env.SMTP_API_KEY) {
        await this.mailService.sendMail({
          to: msg.email,
          from: process.env.SMTP_SENDER,
          subject: 'Email Subject',
          text: 'Email Body',
          // template:''
        });
      }

      this.amqpConnection.publish('', process.env.RABBIT_Q2_NAME, {
        success: true,
        ...msg,
      });
    } catch (error) {
      console.error(error);
      // requeue the message
      return new Nack(true);
    }
  }
}
