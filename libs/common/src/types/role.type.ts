export interface IRole {
  _id: string;
  name: string;
  description: string;
}

export type RoleWithPermissions = Partial<IRole> & {
  permissions: string[];
};
