import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { RequestActionsEnum, ValidateParamIDDto, messages } from '@app/common';
import { Administrator } from './schemas/administrator.schema';
import { AdministratorService } from './administrator.service';
import { JwtAuthGuard } from '@app/common/auth';
import { CreateAdministratorDto } from './dtos/create-administrator.dto';
import { AdministratorRequest } from './requests/administrator.request';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';

@Controller('administrators')
export class AdministratorController {
  private readonly logger = new Logger();
  constructor(private readonly administratorService: AdministratorService) {}

  @Post()
  async create(
    @Body() createDto: CreateAdministratorDto,
    @Res() res: Response,
  ) {
    const createRequest = new AdministratorRequest(
      createDto,
      RequestActionsEnum.CREATE,
    ).doc;
    createRequest.password = await bcrypt.hash(createRequest.password, 10);
    const doc = await this.administratorService.create(createRequest);
    return res.status(HttpStatus.CREATED).json({
      data: doc,
      message: messages.ADMINISTRATOR_CREATED,
    });
  }

  @Get()
  async getAdministrators(@Res() res: Response) {
    const doc = await this.administratorService.getAdministrators({});
    return res.status(HttpStatus.OK).json({
      data: doc,
      message: messages.ADMINISTRATOR_LIST,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getAdministrator(
    @Param() { id }: ValidateParamIDDto,
    @Res() res: Response,
  ) {
    const doc = await this.administratorService.getAdministrator({
      _id: new mongoose.Types.ObjectId(id),
    });
    return res.status(HttpStatus.OK).json({
      data: doc,
      message: messages.ADMINISTRATOR_DETAILS,
    });
  }
}
