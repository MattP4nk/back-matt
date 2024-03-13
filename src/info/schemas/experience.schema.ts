import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type experienceDocument = Experience & Document;
@Schema()
export class Experience {
  @Prop()
  name: string;
  @Prop()
  type: string;
  @Prop()
  details: string;
  @Prop()
  my_growth: string;
}

export const experienceSchema = SchemaFactory.createForClass(Experience);
