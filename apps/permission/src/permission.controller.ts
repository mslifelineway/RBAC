import {
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { AdministratorRoleGuard } from 'apps/administrator/src/auth/guards';
import { JwtAuthGuard, ValidateParamIDDto, messages } from '@app/common';
import { CreatePermissionDto } from './dtos/create-permission.dto';
import { AdministratorRequest } from '../../administrator/src/auth/types';
import { Response } from 'express';
import mongoose from 'mongoose';

@Controller('permissions')
export class PermissionController {
  private readonly logger = new Logger();

  constructor(private readonly permissionService: PermissionService) {}

  @UseGuards(JwtAuthGuard, AdministratorRoleGuard)
  @Post()
  async create(
    @Body() createDto: CreatePermissionDto,
    @Req() req: AdministratorRequest,
    @Res() res: Response,
  ) {
    try {
      const doc = await this.permissionService.create(createDto, req);
      return res.status(HttpStatus.CREATED).json({
        data: doc,
        message: messages.PERMISSION_CREATED,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard, AdministratorRoleGuard)
  @Get()
  async getAll(@Res() res: any) {
    const permissions = await this.permissionService.getPermissions({});
    res.status(HttpStatus.OK).json({
      data: permissions,
      count: permissions.length,
      message: 'List of permissions.',
    });
  }

  @UseGuards(JwtAuthGuard, AdministratorRoleGuard)
  @Get(':id')
  async getOne(@Param() { id }: ValidateParamIDDto, @Res() res: any) {
    const permission = await this.permissionService.getPermission({
      _id: new mongoose.Types.ObjectId(id),
    });
    res.status(HttpStatus.OK).json({
      data: permission,
      messages: 'Permission details.',
    });
  }
}
