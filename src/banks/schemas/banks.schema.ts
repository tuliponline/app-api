import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
export type BankDocument = Bank & Document;

export enum BankStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Schema({ timestamps: true, collection: 'banks' })
export class Bank {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  code: string;

  @Prop({ required: true, enum: BankStatus, default: BankStatus.ACTIVE })
  status: BankStatus;

  @Prop({ required: false })
  logo: string;
}

export const BankSchema = SchemaFactory.createForClass(Bank);
