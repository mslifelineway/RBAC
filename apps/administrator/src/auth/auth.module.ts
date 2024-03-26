import { Module, forwardRef } from '@nestjs/common';
import { AdministratorAuthController } from './auth.controller';
import { AdministratorAuthService } from './auth.service';
import { AdministratorModule } from '../administrator.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  DatabaseModule,
  JWT_EXPIRATION,
  JWT_SECRET,
  RmqModule,
  envPaths,
} from '@app/common';
import * as Joi from 'joi';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy, LocalStrategy } from './strategies';
import { PassportModule } from '@nestjs/passport';
import { ADMINISTRATOR_AUTH_SERVICE } from './constants';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => AdministratorModule),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().required(),
      }),
      envFilePath: envPaths.ADMINISTRATOR,
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
    RmqModule.register({ name: ADMINISTRATOR_AUTH_SERVICE }),
  ],
  controllers: [AdministratorAuthController],
  providers: [AdministratorAuthService, LocalStrategy, JwtStrategy],
})
export class AdministratorAuthModule {}
