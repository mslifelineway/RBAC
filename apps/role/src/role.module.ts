import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import {
  AuthModule,
  DatabaseModule,
  JwtAuthGuard,
  RmqModule,
  envPaths,
} from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './schemas/role.schema';
import { ROLE_SERVICE } from './constants';
import { RoleRepository } from './role.repository';
import { AdministratorRoleGuard } from 'apps/administrator/src/auth/guards';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        MONGODB_URI: Joi.string().required(),
        RABBIT_MQ_AUTH_QUEUE: Joi.string().required(),
        RABBIT_MQ_ROLE_QUEUE: Joi.string().required(),
      }),
      envFilePath: envPaths.ROLE,
    }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    RmqModule.register({
      name: ROLE_SERVICE,
    }),
    AuthModule,
  ],
  controllers: [RoleController],
  providers: [
    RoleService,
    RoleRepository,
    JwtAuthGuard,
    AdministratorRoleGuard,
  ],
})
export class RoleModule {}
