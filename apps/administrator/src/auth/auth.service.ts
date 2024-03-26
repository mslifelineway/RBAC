import { Injectable } from '@nestjs/common';
import { Administrator } from '../schemas/administrator.schema';
import { Response } from 'express';
import { TokenPayload } from './types/auth.type';
import { ConfigService } from '@nestjs/config';
import { Authentication, JWT_EXPIRATION, cookiesOptions } from '@app/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdministratorAuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(administrator: Administrator, response: Response) {
    const payload: TokenPayload = {
      _id: administrator._id.toHexString(),
      firstName: administrator.lastName,
      lastName: administrator.lastName,
      fullName: `${administrator.firstName} ${administrator.lastName}`,
      email: administrator.email,
    };

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get<number>(JWT_EXPIRATION),
    );

    const token = this.jwtService.sign(payload);

    return response.cookie(Authentication, token, {
      ...cookiesOptions,
      expires,
    });
  }

  logout(response: Response) {
    return response.cookie(Authentication, '', {
      ...cookiesOptions,
      expires: new Date(),
    });
  }
}
