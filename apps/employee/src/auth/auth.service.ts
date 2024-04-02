import { Injectable } from '@nestjs/common';
import { Employee } from '../schemas/employee.schema';
import { Response } from 'express';
import { TokenPayload } from './types/auth.type';
import { ConfigService } from '@nestjs/config';
import { Authentication, JWT_EXPIRATION, cookiesOptions } from '@app/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class EmployeeAuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  login(Employee: Employee, response: Response) {
    const payload: TokenPayload = {
      _id: Employee._id.toHexString(),
      firstName: Employee.lastName,
      lastName: Employee.lastName,
      fullName: `${Employee.firstName} ${Employee.lastName}`,
      email: Employee.email,
    };

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get<number>(JWT_EXPIRATION),
    );

    const token = this.jwtService.sign(payload);

    response.cookie(Authentication, token, {
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
