import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable, catchError, tap } from 'rxjs';
import { AUTH_SERVICE } from './auth.constant';
import { ClientProxy } from '@nestjs/microservices';
import { VALIDATE_USER, contextTypes, messages } from '../constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private authClient: ClientProxy) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return this.authClient
      .send(VALIDATE_USER, {
        Authentication: this.getAuthentication(context),
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

  getAuthentication(context: ExecutionContext) {
    let authentication: string;
    if (context.getType() === contextTypes.HTTP) {
      authentication = context.switchToHttp().getRequest()
        .cookies?.Authentication;
    } else if (context.getType() === contextTypes.RPC) {
      authentication = context.switchToRpc().getData().Authentication;
    }

    if (!authentication)
      throw new UnauthorizedException(messages.NO_VALUE_FOR_UNAUTHORIZED);
    return authentication;
  }

  private addUser(user: any, context: ExecutionContext) {
    if (context.getType() === contextTypes.HTTP) {
      context.switchToRpc().getData().user = user;
    } else if (context.getType() === contextTypes.RPC) {
      context.switchToHttp().getRequest().user = user;
    }
  }
}
