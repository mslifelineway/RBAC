import { IsNotEmpty } from 'class-validator';

export class CreatePermissionDto {
  @IsNotEmpty({ message: 'Permission name is required,' })
  name: string;

  @IsNotEmpty({ message: 'Permission description is required.' })
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
