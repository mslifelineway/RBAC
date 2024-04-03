import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_SECRET, messages } from '@app/common';
import { TokenPayload } from '../types/auth.type';
import { Types } from 'mongoose';
import { EmployeeService } from '../../employee.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger();

  constructor(
    configService: ConfigService,
    private readonly employeeService: EmployeeService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => request?.Authentication,
      ]),
      secretOrKey: configService.get(JWT_SECRET),
    });
  }

  async validate(payload: TokenPayload) {
    this.logger.warn(
      '====>>>>> >>>>>>>>> validate in jwt srategy in employee:',
      JSON.stringify(payload),
    );
    const { _id } = payload;
    try {
      const doc = await this.employeeService.findOne({
        _id: _id as unknown as Types.ObjectId,
      });
      return doc;
    } catch (err) {
      throw new UnauthorizedException(messages.UNAUTHORIZED);
    }
  }
}
