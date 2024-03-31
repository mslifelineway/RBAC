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
import { RoleService } from './role.service';
import { AdministratorRoleGuard } from 'apps/administrator/src/auth/guards';
import {
  JwtAuthGuard,
  RequestActionsEnum,
  ValidateParamIDDto,
  ValidateParamStatusDto,
  messages,
} from '@app/common';
import { CreateRoleDto } from './dtos/create.dto';
import { AdministratorRequest } from '../../administrator/src/auth/types';
import { Response } from 'express';
import mongoose from 'mongoose';
import { UpdateRoleDto } from './dtos/update.dto';
import { RoleRequest } from './requests/role.request';
import { toObjectId } from '@app/common/utils/helpers';

@Controller('roles')
// @UseGuards(JwtAuthGuard, AdministratorRoleGuard)
export class RoleController {
  private readonly logger = new Logger();

  constructor(private readonly RoleService: RoleService) {}

  @UseGuards(JwtAuthGuard, AdministratorRoleGuard)
  @Post()
  async create(
    @Body() createDto: CreateRoleDto,
    @Req() req: AdministratorRequest,
    @Res() res: Response,
  ) {
    try {
      const createRequest = new RoleRequest(
        createDto,
        RequestActionsEnum.CREATE,
        req.user,
      ).doc;
      const doc = await this.RoleService.create(createRequest);
      return res.status(HttpStatus.CREATED).json({
        data: doc,
        message: messages.ROLE_CREATED,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard, AdministratorRoleGuard)
  @Get()
  async getAll(@Res() res: any) {
    const Roles = await this.RoleService.findAll({});
    res.status(HttpStatus.OK).json({
      data: Roles,
      count: Roles.length,
      message: 'List of Roles.',
    });
  }

  @UseGuards(JwtAuthGuard, AdministratorRoleGuard)
  @Get(':id')
  async getOne(@Param() { id }: ValidateParamIDDto, @Res() res: any) {
    const Role = await this.RoleService.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });
    res.status(HttpStatus.OK).json({
      data: Role,
      messages: 'Role details.',
    });
  }

  @UseGuards(JwtAuthGuard, AdministratorRoleGuard)
  @Put(':id')
  async update(
    @Param() { id }: ValidateParamIDDto,
    @Body() updateDto: UpdateRoleDto,
    @Req() req: AdministratorRequest,
    @Res() res: Response,
  ) {
    try {
      const updateRequest = new RoleRequest(
        updateDto,
        RequestActionsEnum.UPDATE,
        req.user,
      ).doc;
      updateRequest._id = toObjectId(id);
      const doc = await this.RoleService.updateOne(updateRequest);
      return res.status(HttpStatus.OK).json({
        data: doc,
        message: messages.ROLE_UPDATED,
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
      const currentDoc = await this.RoleService.findOne({
        _id: toObjectId(id),
      });
      const updateDoc = new RoleRequest(
        currentDoc,
        RequestActionsEnum.UPDATE_STATUS,
        req.user,
      ).doc;
      const doc = await this.RoleService.updateStatus(updateDoc);
      return res.status(HttpStatus.OK).json({
        data: doc,
        message: messages.ROLE_STATUS_UPDATED,
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
      const updateRequest = new RoleRequest(
        null,
        RequestActionsEnum.RECOVER,
        req.user,
      ).doc;
      updateRequest._id = toObjectId(id);
      const doc = await this.RoleService.recover(updateRequest);
      return res.status(HttpStatus.OK).json({
        data: doc,
        message: messages.ROLE_RECOVERED,
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
      const updateRequest = new RoleRequest(
        null,
        RequestActionsEnum.DELETE,
        req.user,
      ).doc;
      updateRequest._id = toObjectId(id);
      this.logger.warn('______delete data:', JSON.stringify(updateRequest));
      const doc = await this.RoleService.delete(updateRequest);
      return res.status(HttpStatus.NO_CONTENT).json({
        data: doc,
        message: messages.ROLE_DELETED,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
