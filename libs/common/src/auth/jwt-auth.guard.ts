import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable, catchError, tap } from 'rxjs';
import { AUTH_SERVICE } from './auth.constant';
import { ClientProxy } from '@nestjs/microservices';
import { VALIDATE_USER, contextTypes } from '../constants';
import { getAuthenticationFromContext } from './helper';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger();

  constructor(@Inject(AUTH_SERVICE) private authClient: ClientProxy) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return this.authClient
      .send(VALIDATE_USER, {
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
    if (context.getType() === contextTypes.HTTP) {
      context.switchToRpc().getData().user = user;
    } else if (context.getType() === contextTypes.RPC) {
      context.switchToHttp().getRequest().user = user;
    }
  }
}
