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
import { EmployeeService } from './employee.service';
import { AdministratorRoleGuard } from 'apps/administrator/src/auth/guards';
import {
  JwtAuthGuard,
  RequestActionsEnum,
  ValidateParamIDDto,
  messages,
} from '@app/common';
import { CreateEmployeeDto } from './dtos/create.dto';
import { AdministratorRequest } from '../../administrator/src/auth/types';
import { Response } from 'express';
import mongoose from 'mongoose';
import { UpdateEmployeeDto } from './dtos/update.dto';
import { EmployeeRequest } from './requests/employee.request';
import { toObjectId } from '@app/common/utils/helpers';

@Controller('Employees')
export class EmployeeController {
  private readonly logger = new Logger();

  constructor(private readonly EmployeeService: EmployeeService) {}

  @UseGuards(JwtAuthGuard, AdministratorRoleGuard)
  @Post()
  async create(
    @Body() createDto: CreateEmployeeDto,
    @Req() req: AdministratorRequest,
    @Res() res: Response,
  ) {
    try {
      const createRequest = new EmployeeRequest(
        createDto,
        RequestActionsEnum.CREATE,
        req.user,
      ).doc;
      const doc = await this.EmployeeService.create(createRequest);
      return res.status(HttpStatus.CREATED).json({
        data: doc,
        message: messages.EMPLOYEE_CREATED,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(@Res() res: any) {
    const Employees = await this.EmployeeService.findAll({});
    res.status(HttpStatus.OK).json({
      data: Employees,
      count: Employees.length,
      message: 'List of Employees.',
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getOne(@Param() { id }: ValidateParamIDDto, @Res() res: any) {
    const Employee = await this.EmployeeService.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });
    res.status(HttpStatus.OK).json({
      data: Employee,
      messages: 'Employee details.',
    });
  }

  @UseGuards(JwtAuthGuard, AdministratorRoleGuard)
  @Put(':id')
  async update(
    @Param() { id }: ValidateParamIDDto,
    @Body() updateDto: UpdateEmployeeDto,
    @Req() req: AdministratorRequest,
    @Res() res: Response,
  ) {
    try {
      const updateRequest = new EmployeeRequest(
        updateDto,
        RequestActionsEnum.UPDATE,
        req.user,
      ).doc;
      updateRequest._id = toObjectId(id);
      const doc = await this.EmployeeService.updateOne(updateRequest);
      return res.status(HttpStatus.OK).json({
        data: doc,
        message: messages.EMPLOYEE_UPDATED,
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
      const currentDoc = await this.EmployeeService.findOne({
        _id: toObjectId(id),
      });
      const updateDoc = new EmployeeRequest(
        currentDoc,
        RequestActionsEnum.UPDATE_STATUS,
        req.user,
      ).doc;
      const doc = await this.EmployeeService.updateStatus(updateDoc);
      return res.status(HttpStatus.OK).json({
        data: doc,
        message: messages.EMPLOYEE_STATUS_UPDATED,
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
      const updateRequest = new EmployeeRequest(
        null,
        RequestActionsEnum.RECOVER,
        req.user,
      ).doc;
      updateRequest._id = toObjectId(id);
      const doc = await this.EmployeeService.recover(updateRequest);
      return res.status(HttpStatus.OK).json({
        data: doc,
        message: messages.EMPLOYEE_RECOVERED,
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
      const updateRequest = new EmployeeRequest(
        null,
        RequestActionsEnum.DELETE,
        req.user,
      ).doc;
      updateRequest._id = toObjectId(id);
      const doc = await this.EmployeeService.delete(updateRequest);
      return res.status(HttpStatus.NO_CONTENT).json({
        data: doc,
        message: messages.EMPLOYEE_DELETED,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
