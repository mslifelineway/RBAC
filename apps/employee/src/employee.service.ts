import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { EmployeeRepository } from './employee.repository';
import { Employee } from './schemas/employee.schema';

@Injectable()
export class EmployeeService {
  private readonly logger = new Logger();
  constructor(private readonly EmployeeRepository: EmployeeRepository) {}

  async create(data: Employee): Promise<Employee> {
    const doc = await this.validateCreateEmployeeRequest(data);
    if (doc)
      throw new UnprocessableEntityException(
        `Email '${data.email}' already exists.`,
      );
    return await this.EmployeeRepository.create(data);
  }

  private async validateCreateEmployeeRequest(
    request: Employee,
  ): Promise<Employee> {
    try {
      return await this.EmployeeRepository.findOne({ email: request.email });
    } catch (error) {}
  }

  async findAll(args: Partial<Employee>): Promise<Employee[]> {
    return await this.EmployeeRepository.find(args);
  }

  async findOne(args: Partial<Employee>): Promise<Employee> {
    return await this.EmployeeRepository.findOne(args);
  }

  async updateOne(updateData: Employee) {
    return await this.EmployeeRepository.findOneAndUpdate(
      { _id: updateData._id },
      updateData,
    );
  }

  async updateStatus(data: Employee) {
    return await this.EmployeeRepository.findOneAndUpdate(
      { _id: data._id },
      data,
    );
  }

  async recover(data: Employee) {
    return await this.EmployeeRepository.findOneAndUpdate(
      { _id: data._id },
      data,
    );
  }
  async delete(data: Employee) {
    return await this.EmployeeRepository.findOneAndUpdate(
      { _id: data._id },
      data,
    );
  }
}
