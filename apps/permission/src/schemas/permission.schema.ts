import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, SchemaTypes } from 'mongoose';

@Schema({ versionKey: false })
export class Permission extends AbstractDocument {
  @Prop({ unique: true, required: true, trim: true})
  name: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: false, default: true })
  isActive: boolean;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'Administrator' })
  createdBy: Types.ObjectId;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'Administrator' })
  updatedBy: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
