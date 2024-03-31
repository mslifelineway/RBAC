import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Permission } from '../../../permission/src/schemas/permission.schema';
import { Types, SchemaTypes } from 'mongoose';

@Schema({ versionKey: false })
export class Role extends AbstractDocument {
  @Prop({ unique: true, required: true, trim: true })
  name: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: false, default: true })
  isActive: boolean;

  @Prop({ required: false, default: false })
  isDeleted: boolean;

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'Permission' }] })
  permissions: Permission[];

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'Administrator' })
  createdBy: Types.ObjectId;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'Administrator' })
  updatedBy: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
