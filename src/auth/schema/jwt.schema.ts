import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type jwtDocument = Jwt & Document;
@Schema()
export class Jwt {
  @Prop()
  key: string;
}

export const jwtSchema = SchemaFactory.createForClass(Jwt);