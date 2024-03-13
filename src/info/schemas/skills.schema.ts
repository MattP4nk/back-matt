import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type skillDocument = Skill & Document;
@Schema()
export class Skill {
  @Prop()
  name: string;
  @Prop()
  type: string;
  @Prop()
  knowledge: string;
  @Prop()
  detail: string;
  @Prop()
  thoughts: string;
}

export const skillSchema = SchemaFactory.createForClass(Skill);
