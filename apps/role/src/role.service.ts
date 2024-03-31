import {
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { Role } from './schemas/role.schema';

@Injectable()
export class RoleService {
  private readonly logger = new Logger();
  constructor(private readonly RoleRepository: RoleRepository) {}

  async create(data: Role): Promise<Role> {
    const doc = await this.validateCreateRoleRequest(data);
    if (doc)
      throw new UnprocessableEntityException(
        `Role '${data.name}' already exists.`,
      );
    return await this.RoleRepository.create(data);
  }

  private async validateCreateRoleRequest(request: Role): Promise<Role> {
    try {
      return await this.RoleRepository.findOne({ name: request.name });
    } catch (error) {}
  }

  async findAll(args: Partial<Role>): Promise<Role[]> {
    return await this.RoleRepository.find(args);
  }

  async findOne(args: Partial<Role>): Promise<Role> {
    return await this.RoleRepository.findOne(args);
  }

  async updateOne(updateData: Role) {
    return await this.RoleRepository.findOneAndUpdate(
      { _id: updateData._id },
      updateData,
    );
  }

  async updateStatus(data: Role) {
    return await this.RoleRepository.findOneAndUpdate({ _id: data._id }, data);
  }

  async recover(data: Role) {
    return await this.RoleRepository.findOneAndUpdate({ _id: data._id }, data);
  }
  async delete(data: Role) {
    return await this.RoleRepository.findOneAndUpdate({ _id: data._id }, data);
  }
}
