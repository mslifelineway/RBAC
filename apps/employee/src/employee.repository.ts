import { AbstractRepository, _copy } from '@app/common';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Employee } from './schemas/employee.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
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
        populate: {
          path: 'permissions',
          select: { _id: 1, permissionUniqueKey: 1 },
        },
      });
      const permissionUniqueKeys: string[] = doc.roles.reduce(
        (acc: string[], role) => {
          return acc.concat(
            role.permissions.map(
              (permission) => permission.permissionUniqueKey,
            ),
          );
        },
        [],
      );

      return {
        ..._copy<Employee>(doc),
        permissionUniqueKeys,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
