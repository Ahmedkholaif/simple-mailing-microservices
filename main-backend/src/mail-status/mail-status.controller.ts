import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MailStatusService } from './mail-status.service';
import { CreateMailStatusDto, Status } from './dto/create-mail-status.dto';
import { UpdateMailStatusDto } from './dto/update-mail-status.dto';
import { ConsumeMessage } from 'amqplib';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@Controller('mail')
export class MailStatusController {
  constructor(
    private readonly mailStatusService: MailStatusService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  @Get()
  findAll() {
    return this.mailStatusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.mailStatusService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMailDto: CreateMailStatusDto) {
    const data = await this.mailStatusService.create(createMailDto);
    for (let i = 1; i <= data.totalCount; i++) {
      this.amqpConnection.publish('', process.env.RABBIT_Q_NAME, {
        count: i,
        ...data,
      });
    }
    return data;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMailDto: UpdateMailStatusDto) {
    return this.mailStatusService.update(id, updateMailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mailStatusService.delete(id);
  }

  @RabbitSubscribe({
    exchange: '',
    routingKey: '',
    queue: process.env.RABBIT_Q2_NAME,
  })
  public async updateMailStatus(data: any, amqpMsg: ConsumeMessage) {
    try {
      if (!data.success) return;
      const instance = await this.mailStatusService.findById(data.id);
      const sentCount = instance.sentCount + 1;
      let status: Status;
      if (sentCount >= instance.totalCount) {
        status = Status.Succeeded;
      } else if (sentCount > 0) {
        status = Status.InProgress;
      }

      await this.mailStatusService.update(data.id, {
        sentCount,
        status,
        updatedAt: new Date().toUTCString(),
      });
    } catch (error) {
      console.error(error);
    }
  }
}
