import {
  ExecutionContext,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { contextTypes, messages } from '../constants';

export const getAuthenticationFromContext = (context: ExecutionContext) => {
  let authentication: string;
  if (context.getType() === contextTypes.HTTP) {
    authentication = context.switchToHttp().getRequest()
      .cookies?.Authentication;
  } else if (context.getType() === contextTypes.RPC) {
    authentication = context.switchToRpc().getData().Authentication;
  }

  if (!authentication)
    throw new UnauthorizedException(messages.NO_VALUE_FOR_UNAUTHORIZED);
  const logger = new Logger();
  logger.warn(
    '################### AUTHENTICATION in jwt header ####',
    authentication,
  );
  return authentication;
};
