import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

enum StatusEnum {
  TRUE = 'true',
  FALSE = 'false',
}

export class ValidateParamStatusDto {
  @IsOptional()
  @Transform(({ value }) => ('' + value).toLowerCase())
  @IsEnum(StatusEnum)
  status: boolean;
}
