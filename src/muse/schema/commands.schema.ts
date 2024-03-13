import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type cmdDocument = Cmd & Document;
@Schema()
export class Cmd {
  @Prop()
  name: string;
  @Prop()
  caller: string;
  @Prop()
  type: string;
  @Prop()
  function: string;
  @Prop()
  description: string;
}

export const cmdSchema = SchemaFactory.createForClass(Cmd);
