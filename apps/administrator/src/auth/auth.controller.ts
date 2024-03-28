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
import { VALIDATE_USER, messages } from '@app/common';
import { MessagePattern } from '@nestjs/microservices';
import { AdministratorAuthService } from './auth.service';
import { AdministratorService } from '../administrator.service';
import LocalAuthGuard from './guards/local-auth.guard';
import JwtAdministratorAuthGuard from './guards/jwt-auth.guard';

@Controller('auth')
export class AdministratorAuthController {
  private readonly logger = new Logger();

  constructor(
    private readonly administratorAuthService: AdministratorAuthService,
    private readonly administratorService: AdministratorService,
  ) {}

  @Post()
  async create(
    @Body() createDto: CreateAdministratorDto,
  ): Promise<Administrator> {
    return this.administratorService.createAdministrator(createDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentAdministrator() administrator: Administrator,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.administratorAuthService.login(administrator, response);
    return response.status(HttpStatus.OK).json({
      data: administrator,
      message: messages.LOGIN_SUCCESS,
    });
  }

  @UseGuards(JwtAdministratorAuthGuard)
  @MessagePattern(VALIDATE_USER)
  async validateUser(@CurrentAdministrator() administrator: Administrator) {
    return administrator;
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    this.administratorAuthService.logout(response);
    return response
      .status(HttpStatus.OK)
      .json({ message: messages.LOGOUT_SUCCESS });
  }
}
