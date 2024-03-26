import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { CreateAdministratorDto } from '../dtos/create-administrator.dto';
import { Administrator } from '../schemas/administrator.schema';
import { CurrentAdministrator } from '../decorators/current-administrator.decorator';
import { Response } from 'express';
import { VALIDATE_USER } from '@app/common';
import { MessagePattern } from '@nestjs/microservices';
import { AdministratorAuthService } from './auth.service';
import { AdministratorService } from '../administrator.service';
import LocalAuthGuard from './guards/local-auth.guard';
import JwtAdministratorAuthGuard from './guards/jwt-auth.guard';

@Controller('auth')
export class AdministratorAuthController {
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
  @Post('/login')
  async login(
    @CurrentAdministrator() administrator: Administrator,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.administratorAuthService.login(administrator, response);
    response.send(administrator);
  }

  @UseGuards(JwtAdministratorAuthGuard)
  @MessagePattern(VALIDATE_USER)
  async validateUser(@CurrentAdministrator() administrator: Administrator) {
    return administrator;
  }

  @UseGuards(JwtAdministratorAuthGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    return this.administratorAuthService.logout(response);
  }
}
