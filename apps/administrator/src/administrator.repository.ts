import { AbstractRepository } from '@app/common';
import { Administrator } from './schemas/administrator.schema';
import { Injectable, Logger } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AdministratorRepository extends AbstractRepository<Administrator> {
  protected readonly logger = new Logger();

  constructor(
    @InjectModel(Administrator.name) administratorModel: Model<Administrator>,
    @InjectConnection() connection: Connection,
  ) {
    super(administratorModel, connection);
  }
}
