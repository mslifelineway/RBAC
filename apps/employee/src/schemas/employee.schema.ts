import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { Role } from 'apps/role/src/schemas/role.schema';

@Schema({ versionKey: false })
export class Employee extends AbstractDocument {
  @Prop({ required: true, unique: true, trim: true })
  email: string;

  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ required: true, trim: true })
  password: string;

  @Prop({ required: true, trim: true })
  phoneNumber: string;

  @Prop({ required: false, default: '' })
  image: string;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Role' }] })
  roles: Role[];

  @Prop({ required: false, default: true })
  isActive: boolean;

  @Prop({ required: false, default: false })
  isDeleted: boolean;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'Administrator' })
  createdBy: Types.ObjectId;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'Administrator' })
  updatedBy: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
