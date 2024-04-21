import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Logger,
  Param,
  Patch,
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
// @UseGuards(JwtAuthGuard, AdministratorRoleGuard)
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

  @UseGuards(JwtAuthGuard, AdministratorRoleGuard)
  @Get()
  async getAll(@Res() res: any) {
    const permissions = await this.permissionService.findAll({});
    res.status(HttpStatus.OK).json({
      data: permissions,
      count: permissions.length,
      message: 'List of permissions.',
    });
  }

  @UseGuards(JwtAuthGuard, AdministratorRoleGuard)
  @Get(':id')
  async getOne(@Param() { id }: ValidateParamIDDto, @Res() res: any) {
    const permission = await this.permissionService.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });
    res.status(HttpStatus.OK).json({
      data: permission,
      messages: 'Permission details.',
    });
  }

  @UseGuards(JwtAuthGuard, AdministratorRoleGuard)
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
      const doc = await this.permissionService.updateOne(updateRequest);
      return res.status(HttpStatus.OK).json({
        data: doc,
        message: messages.PERMISSION_UPDATED,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard, AdministratorRoleGuard)
  @Patch(':id/status')
  async updateStatus(
    @Param() { id }: ValidateParamIDDto,
    @Req() req: AdministratorRequest,
    @Res() res: Response,
  ) {
    try {
      const currentDoc = await this.permissionService.findOne({
        _id: toObjectId(id),
      });
      const updateDoc = new PermissionRequest(
        currentDoc,
        RequestActionsEnum.UPDATE_STATUS,
        req.user,
      ).doc;
      const doc = await this.permissionService.updateStatus(updateDoc);
      return res.status(HttpStatus.OK).json({
        data: doc,
        message: messages.PERMISSION_STATUS_UPDATED,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard, AdministratorRoleGuard)
  @Patch(':id/recover')
  async recover(
    @Param() { id }: ValidateParamIDDto,
    @Req() req: AdministratorRequest,
    @Res() res: Response,
  ) {
    try {
      const updateRequest = new PermissionRequest(
        null,
        RequestActionsEnum.RECOVER,
        req.user,
      ).doc;
      updateRequest._id = toObjectId(id);
      const doc = await this.permissionService.recover(updateRequest);
      return res.status(HttpStatus.OK).json({
        data: doc,
        message: messages.PERMISSION_RECOVERED,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard, AdministratorRoleGuard)
  @Delete('/permissionUniqueKey/:permissionUniqueKey')
  async deleteByPermissionKey(
    @Param('permissionUniqueKey') permissionUniqueKey: string,
    @Res() res: Response,
  ) {
    try {
      const doc = await this.permissionService.deleteForever({
        permissionUniqueKey,
      });
      return res.status(HttpStatus.NO_CONTENT).json({
        data: doc,
        message: messages.PERMISSION_DELETED,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard, AdministratorRoleGuard)
  @Delete('/permissionUniqueKeys')
  async deleteAllByPermissionKey(
    @Body('permissionUniqueKeys') permissionUniqueKeys: string[],
    @Res() res: Response,
  ) {
    try {
      const doc = await this.permissionService.deleteManyForever({
        permissionUniqueKey: { $in: permissionUniqueKeys },
      });
      return res.status(HttpStatus.NO_CONTENT).json({
        data: doc,
        message: messages.PERMISSION_DELETED,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard, AdministratorRoleGuard)
  @Delete('/ids')
  async deleteAllByIds(@Body('ids') ids: string[], @Res() res: Response) {
    try {
      const objectIdsToDelete = ids.map(id => toObjectId(id))
      console.log('objectIdsToDelete', objectIdsToDelete)
      const doc = await this.permissionService.deleteManyForever({
        _id: { $in: objectIdsToDelete },
      });
      return res.status(HttpStatus.NO_CONTENT).json({
        data: doc,
        message: messages.PERMISSION_DELETED,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard, AdministratorRoleGuard)
  @Delete(':id')
  async delete(
    @Param() { id }: ValidateParamIDDto,
    @Req() req: AdministratorRequest,
    @Res() res: Response,
  ) {
    try {
      const updateRequest = new PermissionRequest(
        null,
        RequestActionsEnum.DELETE,
        req.user,
      ).doc;
      updateRequest._id = toObjectId(id);
      const doc = await this.permissionService.delete(updateRequest);
      return res.status(HttpStatus.NO_CONTENT).json({
        data: doc,
        message: messages.PERMISSION_DELETED,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
