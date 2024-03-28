import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AdministratorService } from '../../administrator.service';
import { JWT_SECRET, messages } from '@app/common';
import { TokenPayload } from '../types/auth.type';
import { Types } from 'mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger();

  constructor(
    configService: ConfigService,
    private readonly administratorService: AdministratorService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => request?.Authentication,
      ]),
      secretOrKey: configService.get(JWT_SECRET),
    });
  }

  async validate(payload: TokenPayload) {
    const { _id } = payload;
    try {
      return await this.administratorService.getAdministrator({
        _id: _id as unknown as Types.ObjectId,
      });
    } catch (err) {
      throw new UnauthorizedException(messages.UNAUTHORIZED);
    }
  }
}
