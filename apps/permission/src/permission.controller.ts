import { Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { AdministratorRoleGuard } from 'apps/administrator/src/auth/guards';
import { JwtAuthGuard } from '@app/common';

@Controller('permissions')
export class PermissionController {
  private readonly logger = new Logger();

  constructor(private readonly permissionService: PermissionService) {}

  @UseGuards(JwtAuthGuard, AdministratorRoleGuard)
  @Get()
  getHello(@Req() res: any): string {
    return this.permissionService.getHello();
  }

  @Get('/test')
  test(): string {
    return this.permissionService.getHello();
  }
}
