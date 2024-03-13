import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/jwt.strategy';
import { InfoModule } from './info/info.module';
import { MuseController } from './muse/muse.controller';
import { MuseService } from './muse/muse.service';
import { MuseModule } from './muse/muse.module';
import { HttpModule } from '@nestjs/axios';
import { About, aboutSchema } from './info/schemas/about.schema';
import { Education, educationSchema } from './info/schemas/education.schema';
import { Experience, experienceSchema } from './info/schemas/experience.schema';
import { Project, projectSchema } from './info/schemas/projects.schema';
import { Skill, skillSchema } from './info/schemas/skills.schema';
import { Message, messageSchema } from './muse/schema/message.schema';
import { AuthService } from './auth/auth.service';
import { User, userSchema } from './auth/schema/user.schema';

@Module({
  imports: [
    HttpModule,
    InfoModule,
    MongooseModule.forRoot(
      'mongodb+srv://Matt:Matt1001@mattporfolio.9i2zi0r.mongodb.net/porfolio?retryWrites=true&w=majority',
    ),
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
        name: Message.name,
        schema: messageSchema
      }
    ]),
    AuthModule,
    MuseModule
  ],
  controllers: [AppController, MuseController],
  providers: [AppService, JwtStrategy, MuseService, AuthService],
})
export class AppModule {}
