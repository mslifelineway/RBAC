import {
  Body,
  Controller,
  HttpStatus,
  Logger,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateAdministratorDto } from '../dtos/create-administrator.dto';
import { Administrator } from '../schemas/administrator.schema';
import { CurrentAdministrator } from '../decorators/current-administrator.decorator';
import { Response } from 'express';
import {
  RequestActionsEnum,
  VALIDATE_EMPLOYEE,
  VALIDATE_USER,
  messages,
} from '@app/common';
import { MessagePattern } from '@nestjs/microservices';
import { AdministratorAuthService } from './auth.service';
import { AdministratorService } from '../administrator.service';
import LocalAuthGuard from './guards/local-auth.guard';
import JwtAdministratorAuthGuard from './guards/jwt-auth.guard';
import { AdministratorRequest } from '../requests/administrator.request';

@Controller('auth')
export class AdministratorAuthController {
  private readonly logger = new Logger();

  constructor(
    private readonly administratorAuthService: AdministratorAuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentAdministrator() administrator: Administrator,
    @Res({ passthrough: true }) response: Response,
  ) {
    this.administratorAuthService.login(administrator, response);
    response.status(HttpStatus.OK).json({
      data: administrator,
      message: messages.LOGIN_SUCCESS,
    });
  }

  @UseGuards(JwtAdministratorAuthGuard)
  @MessagePattern(VALIDATE_USER)
  validateUser(@CurrentAdministrator() administrator: Administrator) {
    this.logger.warn(
      '################### administrator data in validate user in auth.controller ####',
      JSON.stringify(administrator),
    );
    return administrator;
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    this.administratorAuthService.logout(response);
    response.status(HttpStatus.OK).json({ message: messages.LOGOUT_SUCCESS });
  }
}
