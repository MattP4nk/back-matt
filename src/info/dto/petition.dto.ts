import { IsNotEmpty, ValidateNested } from 'class-validator';
import { AboutMattDto } from './aboutMatt.dto';
import { ExperienceDto } from './experience.dto';
import { Type } from 'class-transformer';
import { EducationDto } from './education.dto';
import { SkillDto } from './skill.dto';
import { ProjectDto } from './project.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PetitionDto {
  @ApiProperty()
  @IsNotEmpty()
  request: string;
  @ApiProperty()
  @IsNotEmpty()
  area: string;
  @ApiProperty()
  target: string;
  @ApiProperty()
  key: string;  
  @ApiProperty()
  @ValidateNested()
  @Type(() => AboutMattDto)
  aboutPackage: AboutMattDto;
  @ApiProperty()
  @ValidateNested()
  @Type(() => ExperienceDto)
  expPackage: ExperienceDto;
  @ApiProperty()
  @ValidateNested()
  @Type(() => EducationDto)
  eduPackage: EducationDto;
  @ApiProperty()
  @ValidateNested()
  @Type(() => SkillDto)
  skillPackage: SkillDto;
  @ApiProperty()
  @ValidateNested()
  @Type(() => ProjectDto)
  projectPackage: ProjectDto;
}
