import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type StartQuestDocument = StartQuest & Document;
@Schema()
export class StartQuest {
  @Prop({ type: Types.ObjectId, ref: 'users', required: true, unique: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  for: string;
}

export const StartQuestSchema = SchemaFactory.createForClass(StartQuest);
