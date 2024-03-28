import { NestFactory } from '@nestjs/core';
import { PermissionModule } from './permission.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(PermissionModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  app.startAllMicroservices();
  await app.listen(configService.get('PORT'));
}
bootstrap();
