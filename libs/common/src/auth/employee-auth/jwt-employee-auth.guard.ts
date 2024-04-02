import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable, catchError, tap } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { VALIDATE_EMPLOYEE, VALIDATE_USER, contextTypes } from '../../constants';
import { getAuthenticationFromContext } from '../helper';
import { AUTH_SERVICE } from '../auth.constant';

@Injectable()
export class JwtEmployeeAuthGuard implements CanActivate {
  private readonly logger = new Logger();

  constructor(@Inject(AUTH_SERVICE) private authClient: ClientProxy) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    this.logger.warn('______________ JwtEmployeeAuthGuard:::',);
    return this.authClient
      .send(VALIDATE_EMPLOYEE, {
        Authentication: getAuthenticationFromContext(context),
      })
      .pipe(
        tap((res) => {
          this.addUser(res, context);
        }),
        catchError((error) => {
          throw new UnauthorizedException();
        }),
      );
  }

  private addUser(user: any, context: ExecutionContext) {
    this.logger.warn('####### adding logged in user to request ####');
    if (context.getType() === contextTypes.HTTP) {
      context.switchToRpc().getData().user = user;
    } else if (context.getType() === contextTypes.RPC) {
      context.switchToHttp().getRequest().user = user;
    }
  }
}
