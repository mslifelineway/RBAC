import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PermissionRepository } from './permission.repository';
import { Permission } from './schemas/permission.schema';

@Injectable()
export class PermissionService {
  private readonly logger = new Logger();
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async create(data: Permission): Promise<Permission> {
    const doc = await this.validateCreatePermissionRequest(data);
    if (doc)
      throw new UnprocessableEntityException(
        `Permission '${data.name}' already exists.`,
      );
    return await this.permissionRepository.create(data);
  }

  private async validateCreatePermissionRequest(
    request: Permission,
  ): Promise<Permission> {
    try {
      return await this.permissionRepository.findOne({ name: request.name });
    } catch (error) {}
  }

  async getPermissions(args: Partial<Permission>): Promise<Permission[]> {
    return await this.permissionRepository.find(args);
  }

  async getPermission(args: Partial<Permission>): Promise<Permission> {
    return await this.permissionRepository.findOne(args);
  }

  async updatePermission(updateData: Permission) {
    return await this.permissionRepository.findOneAndUpdate(
      { _id: updateData._id },
      updateData,
    );
  }
}
