import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type projectDocument = Project & Document;
@Schema()
export class Project {
  @Prop()
  name: string;
  @Prop()
  URL: string;
  @Prop()
  details: string;
  @Prop()
  thoughts: string;
}

export const projectSchema = SchemaFactory.createForClass(Project);
