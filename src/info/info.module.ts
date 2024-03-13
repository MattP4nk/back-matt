import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InfoController } from './info.controller';
import { InfoService } from './info.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { Experience, experienceSchema } from './schemas/experience.schema';
import { Education, educationSchema } from './schemas/education.schema';
import { Skill, skillSchema } from './schemas/skills.schema';
import { About, aboutSchema } from './schemas/about.schema';
import { Project, projectSchema } from './schemas/projects.schema';

@Module({
    imports: [
      MongooseModule.forFeature([
        {
          name: Project.name,
          schema: projectSchema,
        },
        {
          name: Education.name,
          schema: educationSchema,
        },
        {
          name: Experience.name,
          schema: experienceSchema,
        },
        {
          name: About.name,
          schema: aboutSchema,
        },
        {
          name: Skill.name,
          schema: skillSchema,
        },
      ]),
    ],
    controllers: [InfoController],
    providers: [InfoService, JwtAuthGuard],
    exports: [InfoService],
  })
export class InfoModule {}
