import { NestFactory } from '@nestjs/core';
import { AdministratorModule } from './administrator.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { RmqService } from '@app/common';
import { RmqOptions } from '@nestjs/microservices';
import { AUTH_SERVICE } from '@app/common/auth';

async function bootstrap() {
  const app = await NestFactory.create(AdministratorModule);
  app.enableCors({ origin: true, credentials: true });
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice<RmqOptions>(
    rmqService.getOptions(AUTH_SERVICE, true),
  );
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  await app.startAllMicroservices();
  await app.listen(configService.get('PORT'));
}
bootstrap();
