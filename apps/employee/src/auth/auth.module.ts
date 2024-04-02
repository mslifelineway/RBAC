import { Module, forwardRef } from '@nestjs/common';
import { EmployeeAuthController } from './auth.controller';
import { EmployeeAuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  DatabaseModule,
  EMPLOYEE_AUTH_SERVICE,
  JWT_EXPIRATION,
  JWT_SECRET,
  RmqModule,
  envPaths,
} from '@app/common';
import * as Joi from 'joi';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy, LocalStrategy } from './strategies';
import { PassportModule } from '@nestjs/passport';
import { EmployeeModule } from '../employee.module';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => EmployeeModule),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().required(),
      }),
      envFilePath: envPaths.EMPLOYEE,
    }),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>(JWT_SECRET),
        signOptions: {
          expiresIn: `${configService.get(JWT_EXPIRATION)}s`,
        },
      }),
      inject: [ConfigService],
    }),
    RmqModule.register({ name: EMPLOYEE_AUTH_SERVICE }),
  ],
  controllers: [EmployeeAuthController],
  providers: [EmployeeAuthService, LocalStrategy, JwtStrategy],
})
export class EmployeeAuthModule {}
