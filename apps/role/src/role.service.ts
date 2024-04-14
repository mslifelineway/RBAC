import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { Role } from './schemas/role.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoleWithPermissions } from '@app/common/types';

@Injectable()
export class RoleService {
  private readonly logger = new Logger();
  constructor(
    private readonly roleRepository: RoleRepository,
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
  ) {}

  async create(data: Role): Promise<Role> {
    const doc = await this.validateCreateRoleRequest(data);
    if (doc)
      throw new UnprocessableEntityException(
        `Role '${data.name}' already exists.`,
      );
    return await this.roleRepository.create(data);
  }

  private async validateCreateRoleRequest(request: Role): Promise<Role> {
    try {
      return await this.roleRepository.findOne({ name: request.name });
    } catch (error) {}
  }

  async findAll(args: Partial<Role>): Promise<RoleWithPermissions[]> {
    return await this.roleModel
      .find(args, {
        _id: true,
        name: true,
        description: true,
      })
      .populate({
        path: 'permissions',
        select: { _id: true, name: true, description: true },
      });
  }

  async findOne(args: Partial<Role>): Promise<Role> {
    return await this.roleRepository.findOne(args);
  }

  async updateOne(updateData: Role) {
    return await this.roleRepository.findOneAndUpdate(
      { _id: updateData._id },
      updateData,
    );
  }

  async updateStatus(data: Role) {
    return await this.roleRepository.findOneAndUpdate({ _id: data._id }, data);
  }

  async recover(data: Role) {
    return await this.roleRepository.findOneAndUpdate({ _id: data._id }, data);
  }
  async delete(data: Role) {
    return await this.roleRepository.findOneAndUpdate({ _id: data._id }, data);
  }

  async assignPermissionsToRole(id: string, permissionIds: string[]) {
    return await this.roleRepository.findOneAndUpdate(
      { _id: id },
      {
        permissions: permissionIds,
      },
    );
  }
}
