import { Injectable } from '@nestjs/common';
import { Employee } from '../schemas/employee.schema';
import { Response } from 'express';
import { TokenPayload } from './types/auth.type';
import { ConfigService } from '@nestjs/config';
import { Authentication, JWT_EXPIRATION, cookiesOptions } from '@app/common';
import { JwtService } from '@nestjs/jwt';
import { EmployeeService } from '../employee.service';

@Injectable()
export class EmployeeAuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly employeeService: EmployeeService,
  ) {}

  async login(employee: Employee, response: Response) {
    const payload: TokenPayload = {
      _id: employee._id.toHexString(),
      firstName: employee.lastName,
      lastName: employee.lastName,
      fullName: `${employee.firstName} ${employee.lastName}`,
      email: employee.email,
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
    return await this.employeeService.getLoginDetails({ _id: employee._id });
  }

  logout(response: Response) {
    return response.cookie(Authentication, '', {
      ...cookiesOptions,
      expires: new Date(),
    });
  }
}
