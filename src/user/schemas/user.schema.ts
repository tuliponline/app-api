import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.USER })
  userRole: string;

  @Prop()
  avatar: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  birthDate: Date;

  @Prop()
  bankId: Types.ObjectId;

  @Prop()
  bankBranch: string;

  @Prop()
  bankAccount: string;

  @Prop()
  bankAccountNumber: string;

  @Prop()
  bankBookImage: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
