import { Module } from '@nestjs/common';
import { MuseService } from './muse.service';
import { MuseController } from './muse.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cmd, cmdSchema } from './schema/commands.schema';
import { HttpModule } from '@nestjs/axios';
import { InfoService } from 'src/info/info.service';
import { Project, projectSchema } from 'src/info/schemas/projects.schema';
import { About, aboutSchema } from 'src/info/schemas/about.schema';
import { Education, educationSchema } from 'src/info/schemas/education.schema';
import { Experience, experienceSchema } from 'src/info/schemas/experience.schema';
import { Skill, skillSchema } from 'src/info/schemas/skills.schema';
import { Message, messageSchema } from './schema/message.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { User, userSchema } from 'src/auth/schema/user.schema';

@Module({
  imports:[
    HttpModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: userSchema
      },
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
      {
        name: Cmd.name,
        schema: cmdSchema,
      },
      {
        name: Message.name,
        schema: messageSchema
      }
    ])
  ],
  controllers: [MuseController],
  providers: [MuseService, InfoService, JwtAuthGuard, AuthService]
})
export class MuseModule {}
