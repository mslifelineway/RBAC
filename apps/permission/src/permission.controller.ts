import {
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { AdministratorRoleGuard } from 'apps/administrator/src/auth/guards';
import {
  JwtAuthGuard,
  RequestActionsEnum,
  ValidateParamIDDto,
  messages,
} from '@app/common';
import { CreatePermissionDto } from './dtos/create-permission.dto';
import { AdministratorRequest } from '../../administrator/src/auth/types';
import { Response } from 'express';
import mongoose from 'mongoose';
import { UpdatePermissionDto } from './dtos/update-permission.dto';
import { PermissionRequest } from './requests/permission.request';
import { toObjectId } from '@app/common/utils/helpers';

@Controller('permissions')
@UseGuards(JwtAuthGuard, AdministratorRoleGuard)
export class PermissionController {
  private readonly logger = new Logger();

  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  async create(
    @Body() createDto: CreatePermissionDto,
    @Req() req: AdministratorRequest,
    @Res() res: Response,
  ) {
    try {
      const createRequest = new PermissionRequest(
        createDto,
        RequestActionsEnum.CREATE,
        req.user,
      ).doc;
      const doc = await this.permissionService.create(createRequest);
      return res.status(HttpStatus.CREATED).json({
        data: doc,
        message: messages.PERMISSION_CREATED,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get()
  async getAll(@Res() res: any) {
    const permissions = await this.permissionService.getPermissions({});
    res.status(HttpStatus.OK).json({
      data: permissions,
      count: permissions.length,
      message: 'List of permissions.',
    });
  }

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

  @Put(':id')
  async update(
    @Param() { id }: ValidateParamIDDto,
    @Body() updateDto: UpdatePermissionDto,
    @Req() req: AdministratorRequest,
    @Res() res: Response,
  ) {
    try {
      const updateRequest = new PermissionRequest(
        updateDto,
        RequestActionsEnum.UPDATE,
        req.user,
      ).doc;
      updateRequest._id = toObjectId(id);
      const doc = await this.permissionService.updatePermission(updateRequest);
      return res.status(HttpStatus.CREATED).json({
        data: doc,
        message: messages.PERMISSION_CREATED,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
