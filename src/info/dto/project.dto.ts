import { ApiProperty } from "@nestjs/swagger";

export class ProjectDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  URL: string;
  @ApiProperty()
  details: string;
  @ApiProperty()
  thoughts: string;
}
