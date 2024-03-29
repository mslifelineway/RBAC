import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PermissionRepository } from './permission.repository';
import { CreatePermissionDto } from './dtos/create-permission.dto';
import { AdministratorRequest } from '../../administrator/src/auth/types';
import { Permission } from './schemas/permission.schema';

@Injectable()
export class PermissionService {
  private readonly logger = new Logger();
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async create(
    createDto: CreatePermissionDto,
    req: AdministratorRequest,
  ): Promise<Permission> {
    const doc = await this.validateCreatePermissionRequest(createDto);
    if (doc)
      throw new UnprocessableEntityException(
        `Permission '${createDto.name}' already exists.`,
      );
    return await this.permissionRepository.create({
      ...createDto,
      createdBy: req.user?._id,
      updatedBy: req.user?._id,
    });
  }

  private async validateCreatePermissionRequest(
    request: CreatePermissionDto,
  ): Promise<Permission> {
    return await this.permissionRepository.findOne({ name: request.name });
  }

  async getPermissions(args: Partial<Permission>): Promise<Permission[]> {
    return await this.permissionRepository.find(args);
  }

  async getPermission(args: Partial<Permission>): Promise<Permission> {
    return await this.permissionRepository.findOne(args);
  }
}
