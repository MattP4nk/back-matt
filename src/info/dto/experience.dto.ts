import { ApiProperty } from "@nestjs/swagger";

export class ExperienceDto {
    @ApiProperty()
    name: string;
    @ApiProperty()
    type: string;
    @ApiProperty()
    details: string;
    @ApiProperty()
    my_growth: string;
}
  