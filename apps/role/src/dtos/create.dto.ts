import { IsArray, IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'Role name is required,' })
  name: string;

  @IsNotEmpty({ message: 'Role description is required.' })
  description: string;

  @IsNotEmpty({ message: 'Permissions are required.' })
  @IsArray()
  @IsMongoId({ each: true })
  permissions: string[];
}
