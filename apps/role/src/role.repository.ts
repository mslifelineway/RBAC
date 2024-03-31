import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { Role } from './schemas/role.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

@Injectable()
export class RoleRepository extends AbstractRepository<Role> {
  protected readonly logger = new Logger();

  constructor(
    @InjectModel(Role.name) RoleModel: Model<Role>,
    @InjectConnection() connection: Connection,
  ) {
    super(RoleModel, connection);
  }
}
