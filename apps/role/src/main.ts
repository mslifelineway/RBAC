import { NestFactory } from '@nestjs/core';
import { RoleModule } from './role.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(RoleModule);
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  app.startAllMicroservices();
  await app.listen(configService.get('PORT'));
}
bootstrap();
