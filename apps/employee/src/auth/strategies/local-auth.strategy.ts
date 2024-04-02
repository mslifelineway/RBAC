import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { EmployeeService } from '../../employee.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly employeeService: EmployeeService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    return this.employeeService.validateEmployee(email, password);
  }
}
