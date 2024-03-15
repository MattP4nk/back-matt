import { ApiProperty } from "@nestjs/swagger";

export class SkillDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  type: string;
  @ApiProperty()
  knowledge: string;
  @ApiProperty()
  detail: string;
  @ApiProperty()
  thoughts: string;
  @ApiProperty()
  growt: string;
}
