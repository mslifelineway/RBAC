import {
  ArrayMinSize,
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'Role name is required,' })
  name: string;

  @IsNotEmpty({ message: 'Role description is required.' })
  description: string;

  @IsOptional()
  @IsArray({ message: 'Permissions must be an array.' })
  @ArrayMinSize(1, { message: 'At least one permission is required.' })
  @IsMongoId({
    each: true,
    message: 'Each permission must be a valid MongoDB ObjectID.',
  })
  permissions: string[];
}
