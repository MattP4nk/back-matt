import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type educationDocument = Education & Document;
@Schema()
export class Education {
  @Prop()
  name: string;
  @Prop()
  type: string;
  @Prop()
  details: string;
  @Prop()
  my_growth: string;
}

export const educationSchema = SchemaFactory.createForClass(Education);
