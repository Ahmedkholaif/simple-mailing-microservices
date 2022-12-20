import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailStatusModule } from './mail-status/mail-status.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      port: +process.env.DB_PORT,
      host: process.env.DB_HOST,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: process.env.DB_SYNC === 'true', // should be disabled on production - sync db with every restart
      autoLoadEntities: true,
    }),
    MailStatusModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
