import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { Permission } from './schemas/permission.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

@Injectable()
export class PermissionRepository extends AbstractRepository<Permission> {
  protected readonly logger = new Logger();

  constructor(
    @InjectModel(Permission.name) permissionModel: Model<Permission>,
    @InjectConnection() connection: Connection,
  ) {
    super(permissionModel, connection);
  }
}
