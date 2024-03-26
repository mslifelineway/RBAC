import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import {
  DatabaseModule,
  RmqModule,
  AuthModule,
  JwtAuthGuard,
  envPaths,
} from '@app/common';
import { ADMINISTRATOR_SERVICE } from './constants';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Administrator,
  AdministratorSchema,
} from './schemas/administrator.schema';
import { AdministratorController } from './administrator.controller';
import { AdministratorService } from './administrator.service';
import { AdministratorRepository } from './administrator.repository';
import { AdministratorAuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/strategies';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        MONGODB_URI: Joi.string().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_ADMINISTRATOR_QUEUE: Joi.string().required(),
        RABBIT_MQ_AUTH_QUEUE: Joi.string().required(),
      }),
      envFilePath: envPaths.ADMINISTRATOR,
    }),
    MongooseModule.forFeature([
      {
        name: Administrator.name,
        schema: AdministratorSchema,
      },
    ]),
    RmqModule.register({ name: ADMINISTRATOR_SERVICE }),
    AdministratorAuthModule,
    AuthModule,
  ],
  controllers: [AdministratorController],
  providers: [
    AdministratorService,
    AdministratorRepository,
    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: [AdministratorService],
})
export class AdministratorModule {}
