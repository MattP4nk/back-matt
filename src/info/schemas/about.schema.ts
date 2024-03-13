import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type aboutDocument = About & Document;
@Schema()
export class About {
  @Prop()
  first_name: string;
  @Prop()
  last_name: string;
  @Prop()
  nacionality: string;
  @Prop()
  phone_number: number;
  @Prop()
  email: string;
  @Prop()
  title: string;
  @Prop()
  picture: string;
  @Prop()
  about_me: string;
  @Prop()
  personal_info: string;
}

export const aboutSchema = SchemaFactory.createForClass(About);
