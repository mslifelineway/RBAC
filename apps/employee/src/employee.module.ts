import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { EmployeeRepository } from './employee.repository';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import {
  AuthModule,
  DatabaseModule,
  JwtAuthGuard,
  JwtEmployeeAuthGuard,
  RmqModule,
  envPaths,
} from '@app/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Employee, EmployeeSchema } from './schemas/employee.schema';
import { EMPLOYEE_SERVICE } from './constants';
import { AdministratorRoleGuard } from '../../administrator/src/auth/guards';
import { EmployeeAuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/strategies';
import { Role, RoleSchema } from '../../role/src/schemas/role.schema';
import {
  Permission,
  PermissionSchema,
} from '../../permission/src/schemas/permission.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        MONGODB_URI: Joi.string().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_AUTH_QUEUE: Joi.string().required(),
        RABBIT_MQ_EMPLOYEE_QUEUE: Joi.string().required(),
      }),
      envFilePath: envPaths.EMPLOYEE,
    }),
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Employee.name, schema: EmployeeSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema },
    ]),
    RmqModule.register({
      name: EMPLOYEE_SERVICE,
    }),
    EmployeeAuthModule,
    AuthModule,
  ],
  controllers: [EmployeeController],
  providers: [
    EmployeeService,
    EmployeeRepository,
    JwtStrategy,
    JwtEmployeeAuthGuard,
    // JwtAuthGuard,
    // AdministratorRoleGuard,
  ],
  exports: [EmployeeService],
})
export class EmployeeModule {}
