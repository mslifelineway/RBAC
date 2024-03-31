import {
  IsArray,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsPhoneNumber,
  Length,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsNotEmpty({ message: 'First name is required,' })
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required.' })
  lastName: string;

  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Email is not valid.' })
  email: string;

  @IsNotEmpty({ message: 'Password is required.' })
  @Length(8, 8, { message: 'Password length must be 8 chars only.' })
  password: string;

  @IsNotEmpty({ message: 'Phone number is required.' })
  @IsPhoneNumber('IN', {
    message: 'Invalid phone number (only Indian phone number is allowed).',
  })
  phoneNumber: string;

  @IsNotEmpty({ message: 'Roles are required.' })
  @IsArray()
  @IsMongoId({ each: true })
  roles: string[];
}
