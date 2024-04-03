import { AbstractRepository, _copy } from '@app/common';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Employee } from './schemas/employee.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Role } from '../../role/src/schemas/role.schema';
import { EmployeLoginDetails } from './auth/types';

@Injectable()
export class EmployeeRepository extends AbstractRepository<Employee> {
  protected readonly logger = new Logger();

  constructor(
    @InjectModel(Employee.name) private readonly employeeModel: Model<Employee>,
    @InjectConnection() connection: Connection,
  ) {
    super(employeeModel, connection);
  }

  async getLoginDetails(args: Partial<Employee>): Promise<EmployeLoginDetails> {
    try {
      const doc = await this.employeeModel.findById(args._id).populate({
        path: 'roles',
        select: { _id: 1, name: 1 },
        populate: { path: 'permissions', select: { _id: 1, name: 1 } },
      });
      const permissions: string[] = doc.roles.reduce((acc: string[], role) => {
        return acc.concat(
          role.permissions.map((permission) => permission.name),
        );
      }, []);

      return {
        ..._copy<Employee>(doc),
        permissions,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
