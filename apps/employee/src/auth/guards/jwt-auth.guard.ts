import { AuthGuard } from '@nestjs/passport';

export default class JwtEmployeeAuthGuard extends AuthGuard('jwt') {}
