import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Administrator } from '../schemas/administrator.schema';

export const getCurrentAdministrator = (
  context: ExecutionContext,
): Administrator => {
  if (context.getType() === 'http') {
    return context.switchToHttp().getRequest().user;
  }
  if (context.getType() === 'rpc') {
    return context.switchToRpc().getData().user;
  }
};

export const CurrentAdministrator = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentAdministrator(context),
);
