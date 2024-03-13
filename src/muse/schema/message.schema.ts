import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsNotEmpty } from "class-validator";

export type messageDocument = Message & Document
@Schema()
export class Message {
    @Prop()
    @IsNotEmpty()
    sender: string;
    @Prop()
    @IsNotEmpty()
    message: string;
    @Prop()
    @IsNotEmpty()
    date: string;
    @Prop()
    @IsNotEmpty()
    read: boolean;
}

export const messageSchema = SchemaFactory.createForClass(Message);