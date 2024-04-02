import { Request } from 'express';
import { Employee } from '../../schemas/employee.schema';
export interface TokenPayload {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
}

export interface EmployeeRequest extends Request {
  user: Employee;
}
