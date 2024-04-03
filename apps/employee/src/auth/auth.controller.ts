import {
  Controller,
  HttpStatus,
  Logger,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Employee } from '../schemas/employee.schema';
import { CurrentEmployee } from '../decorators/current-employee.decorator';
import { Response } from 'express';
import { VALIDATE_EMPLOYEE, VALIDATE_USER, messages } from '@app/common';
import { MessagePattern } from '@nestjs/microservices';
import { EmployeeAuthService } from './auth.service';
import { EmployeeService } from '../employee.service';
import LocalAuthGuard from './guards/local-auth.guard';
import JwtEmployeeAuthGuard from './guards/jwt-auth.guard';

@Controller('auth')
export class EmployeeAuthController {
  private readonly logger = new Logger();

  constructor(
    private readonly employeeAuthService: EmployeeAuthService,
    private readonly employeeService: EmployeeService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentEmployee() employee: Employee,
    @Res({ passthrough: true }) response: Response,
  ) {
    const loginDetails = await this.employeeAuthService.login(
      employee,
      response,
    );
    response.status(HttpStatus.OK).json({
      data: loginDetails,
      message: messages.LOGIN_SUCCESS,
    });
  }

  @UseGuards(JwtEmployeeAuthGuard)
  @MessagePattern(VALIDATE_EMPLOYEE)
  validateUser(@CurrentEmployee() employee: Employee) {
    this.logger.warn(
      '################### Employee data in validate user in auth.controller ####',
      JSON.stringify(Employee),
    );
    return employee;
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    this.employeeAuthService.logout(response);
    response.status(HttpStatus.OK).json({ message: messages.LOGOUT_SUCCESS });
  }
}
