import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DEFAULT_ADMINISTRATOR_ROLE } from '../constants';

@Schema({ versionKey: false })
export class Administrator extends AbstractDocument {
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

  @Prop({ required: false, default: [DEFAULT_ADMINISTRATOR_ROLE] })
  roles: string[];

  @Prop({ required: false, default: true })
  isActive: boolean;

  @Prop({ required: false, default: false })
  isDeleted: boolean;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const AdministratorSchema = SchemaFactory.createForClass(Administrator);
