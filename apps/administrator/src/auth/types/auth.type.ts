import { Request } from 'express';
import { Administrator } from '../../schemas/administrator.schema';
export interface TokenPayload {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
}

export interface AdministratorRequest extends Request {
  user: Administrator;
}
