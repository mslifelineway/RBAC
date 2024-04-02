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
import { AdministratorRoleGuard } from 'apps/administrator/src/auth/guards';
import { EmployeeAuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/strategies';

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
  exports: [EmployeeService]
})
export class EmployeeModule {}
