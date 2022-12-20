import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMailStatusDto } from './dto/create-mail-status.dto';
import { UpdateMailStatusDto } from './dto/update-mail-status.dto';
import { MailStatus } from './entities/mail-status.entity';

@Injectable()
export class MailStatusService {
  constructor(
    @InjectRepository(MailStatus)
    private readonly mailStatusRepository: Repository<MailStatus>,
  ) {}

  async findAll() {
    return this.mailStatusRepository.find({});
  }

  async findById(id: any) {
    const mailStatus = await this.mailStatusRepository.findOne({
      where: { id },
    });
    if (!mailStatus) {
      throw new NotFoundException(`mailStatus with id:${id} not found`);
    }
    return mailStatus;
  }
  async findOne(filter: any) {
    const mailStatus = await this.mailStatusRepository.findOne({
      where: filter,
    });
    if (!mailStatus) {
      throw new NotFoundException(`mailStatus not found`);
    }
    return mailStatus;
  }

  async create(createmailStatusDto: CreateMailStatusDto) {
    const mailStatus = this.mailStatusRepository.create({
      ...createmailStatusDto,
    });
    return this.mailStatusRepository.save(mailStatus);
  }

  async update(id: string, updatemailStatusDto: UpdateMailStatusDto) {
    const mailStatus = await this.mailStatusRepository.preload({
      id: +id,
      ...updatemailStatusDto,
    });
    if (!mailStatus) {
      throw new NotFoundException(`mailStatus #${id} not found`);
    }
    return this.mailStatusRepository.save(mailStatus);
  }

  async delete(id: any) {
    const mailStatus = await this.mailStatusRepository.findOne({
      where: { id },
    });
    if (mailStatus) {
      this.mailStatusRepository.remove(mailStatus);
    }
  }

  findByFilter(filter: any) {
    return this.mailStatusRepository.find(filter);
  }
}
