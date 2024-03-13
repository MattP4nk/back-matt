import { ApiProperty } from "@nestjs/swagger";

export class EducationDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  type: string;
  @ApiProperty()
  details: string;
  @ApiProperty()
  my_growth: string;
}
