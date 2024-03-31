import { CreateEmployeeDto } from './create.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {}
