import { RoleWithPermissions } from './role.type';

export interface IEmployee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export type EmployeeWithRolesAndPermissions = Partial<IEmployee> & {
  roles: RoleWithPermissions[];
};
