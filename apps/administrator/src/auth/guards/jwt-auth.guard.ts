import { AuthGuard } from '@nestjs/passport';

export default class JwtAdministratorAuthGuard extends AuthGuard('jwt') {}
