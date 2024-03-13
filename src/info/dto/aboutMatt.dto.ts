import { ApiProperty } from "@nestjs/swagger";

export class AboutMattDto {
  @ApiProperty()
  first_name: string;
  @ApiProperty()
  last_name: string;
  @ApiProperty()
  nacionality: string;
  @ApiProperty()
  phone_number: number;
  @ApiProperty()
  email: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  picture: string;
  @ApiProperty()
  about_me: string;
  @ApiProperty()
  personal_info: string;
}
