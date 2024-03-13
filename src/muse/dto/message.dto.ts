import { IsNotEmpty } from "class-validator";

export class MessageDto {
    @IsNotEmpty()
    sender!: string;
    @IsNotEmpty()
    message!: string;
    date!: string;
    read?: boolean;
}