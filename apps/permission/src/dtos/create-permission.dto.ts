import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePermissionDto {
  @IsNotEmpty({ message: 'Permission name is required,' })
  name: string;

  @IsNotEmpty({ message: 'Permission description is required.' })
  description: string;

  @IsOptional()
  @IsMongoId({ message: 'Parent ID must be an object ID.' })
  parent: string;

  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
