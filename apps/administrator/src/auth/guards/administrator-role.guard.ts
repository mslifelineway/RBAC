import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { getCurrentAdministrator } from '../../decorators/current-administrator.decorator';
import { DEFAULT_ADMINISTRATOR_ROLE } from '../../constants';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AdministratorRoleGuard implements CanActivate {
  private readonly logger = new Logger();

  constructor(private reflector: Reflector) {}

  matchRoles(roles: string[], currentUserRoles: string[]) {
    return roles.some((role) => currentUserRoles.includes(role));
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    ) || [DEFAULT_ADMINISTRATOR_ROLE];
    const user = getCurrentAdministrator(context);
    return this.matchRoles(roles, user.roles);
  }
}
