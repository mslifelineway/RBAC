import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { Employee } from './schemas/employee.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

@Injectable()
export class EmployeeRepository extends AbstractRepository<Employee> {
  protected readonly logger = new Logger();

  constructor(
    @InjectModel(Employee.name) EmployeeModel: Model<Employee>,
    @InjectConnection() connection: Connection,
  ) {
    super(EmployeeModel, connection);
  }
}
