import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PermissionRepository } from './permission.repository';
import { Permission } from './schemas/permission.schema';
import { FilterQuery } from 'mongoose';
import { ParentChildData, prepareParentChildData } from '@app/common';

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

  async findAll(args: Partial<Permission>): Promise<Permission[]> {
    try {
      const data: Permission[] = await this.permissionRepository.find(args);
      // .sort({ parent: 1 });
      // return prepareParentChildData<Permission>(data);
      return data;
    } catch (error) {
      this.logger.warn(error.message);
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(args: Partial<Permission>): Promise<Permission> {
    return await this.permissionRepository.findOne(args);
  }

  async updateOne(updateData: Permission) {
    return await this.permissionRepository.findOneAndUpdate(
      { _id: updateData._id },
      updateData,
    );
  }

  async updateStatus(data: Permission) {
    return await this.permissionRepository.findOneAndUpdate(
      { _id: data._id },
      data,
    );
  }

  async recover(data: Permission) {
    return await this.permissionRepository.findOneAndUpdate(
      { _id: data._id },
      data,
    );
  }
  async delete(data: Permission) {
    return await this.permissionRepository.findOneAndUpdate(
      { _id: data._id },
      data,
    );
  }
  async deleteForever(filterQuery: FilterQuery<Permission>) {
    return await this.permissionRepository.deleteOne(filterQuery);
  }
  async deleteManyForever(filterQuery: FilterQuery<Permission>) {
    return await this.permissionRepository.deleteMany(filterQuery);
  }
}
