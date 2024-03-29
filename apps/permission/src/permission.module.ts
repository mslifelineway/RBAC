import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
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
import { Permission, PermissionSchema } from './schemas/permission.schema';
import { AdministratorRoleGuard } from '../../administrator/src/auth/guards';
import { PERMISSION_SERVICE } from './constants';
import { PermissionRepository } from './permission.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        MONGODB_URI: Joi.string().required(),
        RABBIT_MQ_AUTH_QUEUE: Joi.string().required(),
        RABBIT_MQ_PERMISSION_QUEUE: Joi.string().required(),
      }),
      envFilePath: envPaths.PERMISSION,
    }),
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Permission.name, schema: PermissionSchema },
    ]),
    RmqModule.register({
      name: PERMISSION_SERVICE,
    }),
    AuthModule,
  ],
  controllers: [PermissionController],
  providers: [
    PermissionService,
    PermissionRepository,
    JwtAuthGuard,
    AdministratorRoleGuard,
  ],
})
export class PermissionModule {}
