import {
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  Connection,
  FilterQuery,
  Model,
  ProjectionType,
  SaveOptions,
  Types,
  UpdateQuery,
} from 'mongoose';
import { AbstractDocument } from './abstract.schema';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(
    protected readonly model: Model<TDocument>,
    protected readonly connection: Connection,
  ) {}

  async create(
    document: Omit<TDocument, '_id'>,
    options?: SaveOptions,
  ): Promise<TDocument> {
    const createDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    const doc = await createDocument.save(options);
    return doc.toJSON() as unknown as TDocument;
  }

  async findOne(
    filterQuery: FilterQuery<TDocument>,
    projection: ProjectionType<TDocument> = {},
  ): Promise<TDocument> {
    const document = await this.model.findOne(filterQuery, projection, {
      lean: true,
    });
    if (!document) {
      throw new NotFoundException('Document not found');
    }
    return document as unknown as TDocument;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ) {
    const document = await this.model.findOneAndUpdate(filterQuery, update, {
      lean: true,
      new: true,
    });

    if (!document) {
      throw new NotFoundException('Document not found.');
    }

    return document;
  }

  async upsert(
    filterQuery: FilterQuery<TDocument>,
    document: Partial<TDocument>,
  ) {
    return await this.model.findOneAndUpdate(filterQuery, document, {
      lean: true,
      upsert: true,
      new: true,
    });
  }

  find(
    filterQuery: FilterQuery<TDocument>,
    projection: ProjectionType<TDocument> = {},
  ) {
    return this.model.find(filterQuery, projection, { lean: true });
  }

  async deleteOne(filterQuery: FilterQuery<TDocument>) {
    try {
      return await this.model.deleteOne(filterQuery);
    } catch (error) {
      throw new InternalServerErrorException('Error while deleting data.');
    }
  }

  async deleteMany(filterQuery: FilterQuery<TDocument>) {
    try {
      return await this.model.deleteMany(filterQuery);
    } catch (error) {
      throw new InternalServerErrorException('Error while deleting data.');
    }
  }

  async startTransaction() {
    const session = await this.connection.startSession();
    session.startTransaction();
    return session;
  }
}
