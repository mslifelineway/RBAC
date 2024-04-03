import {
  Injectable,
  Logger,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { EmployeeRepository } from './employee.repository';
import { Employee } from './schemas/employee.schema';
import * as bcrypt from 'bcrypt';
import { ProjectionType } from 'mongoose';
import { EmployeLoginDetails } from './auth/types';

@Injectable()
export class EmployeeService {
  private readonly logger = new Logger();
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async create(data: Employee): Promise<Employee> {
    const doc = await this.validateCreateEmployeeRequest(data);
    if (doc)
      throw new UnprocessableEntityException(
        `Email '${data.email}' already exists.`,
      );
    return await this.employeeRepository.create(data);
  }

  private async validateCreateEmployeeRequest(
    request: Employee,
  ): Promise<Employee> {
    try {
      return await this.employeeRepository.findOne({ email: request.email });
    } catch (error) {}
  }

  async findAll(args: Partial<Employee>): Promise<Employee[]> {
    return await this.employeeRepository.find(args);
  }

  async findOne(
    args: Partial<Employee>,
    projection: ProjectionType<Employee> = {},
  ): Promise<Employee> {
    return await this.employeeRepository.findOne(args, projection);
  }

  async updateOne(updateData: Employee) {
    return await this.employeeRepository.findOneAndUpdate(
      { _id: updateData._id },
      updateData,
    );
  }

  async updateStatus(data: Employee) {
    return await this.employeeRepository.findOneAndUpdate(
      { _id: data._id },
      data,
    );
  }

  async recover(data: Employee) {
    return await this.employeeRepository.findOneAndUpdate(
      { _id: data._id },
      data,
    );
  }
  async delete(data: Employee) {
    return await this.employeeRepository.findOneAndUpdate(
      { _id: data._id },
      data,
    );
  }

  async validateEmployee(email: string, password: string) {
    const user = await this.employeeRepository.findOne({ email });
    this.logger.warn(
      '======> validate emp in emp service::',
      JSON.stringify(user),
      email,
      password,
    );
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return user;
  }

  async getLoginDetails(args: Partial<Employee>): Promise<EmployeLoginDetails> {
    return await this.employeeRepository.getLoginDetails(args);
  }
}
