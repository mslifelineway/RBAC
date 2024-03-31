import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Employee } from '../schemas/employee.schema';

export const getCurrentEmployee = (context: ExecutionContext): Employee => {
  if (context.getType() === 'http') {
    return context.switchToHttp().getRequest().user;
  }
  if (context.getType() === 'rpc') {
    return context.switchToRpc().getData().user;
  }
};

export const CurrentEmployee = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => getCurrentEmployee(context),
);
