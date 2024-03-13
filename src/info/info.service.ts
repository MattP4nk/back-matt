import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { About, aboutDocument } from './schemas/about.schema';
import { Model } from 'mongoose';
import { AboutMattDto } from './dto/aboutMatt.dto';
import { Experience, experienceDocument } from './schemas/experience.schema';
import { ExperienceDto } from './dto/experience.dto';
import { EducationDto } from './dto/education.dto';
import { Education, educationDocument } from './schemas/education.schema';
import { Skill, skillDocument } from './schemas/skills.schema';
import { SkillDto } from './dto/skill.dto';
import { ProjectDto } from './dto/project.dto';
import { Project, projectDocument } from './schemas/projects.schema';

@Injectable()
export class InfoService {
    constructor(
        @InjectModel(About.name) private aboutModule: Model<aboutDocument>,
        @InjectModel(Experience.name) private expModel: Model<experienceDocument>,
        @InjectModel(Education.name) private eduModel: Model<educationDocument>,
        @InjectModel(Skill.name) private skillModel: Model<skillDocument>,
        @InjectModel(Project.name) private projectModel: Model<projectDocument>
      ) {}
    
      private mattID = '6448649badab4b04c978366d';
    

      //Matt Info
      async findMatt(): Promise<AboutMattDto>{
        return await this.aboutModule.findById(this.mattID);
      }
    
      async updateMatt(aboutMattDto: AboutMattDto) {
        let updatedMatt = await this.aboutModule.findByIdAndUpdate(
          this.mattID,
          aboutMattDto,
          { new: true },
        );
        updatedMatt._id = 'O01';
        return updatedMatt;
      }


      //Experience Info
      async createExp(createExperienceDto: ExperienceDto) {
        return await this.expModel.create(createExperienceDto);
      }
    
      async findAllExp() {
        return await this.expModel.find();
      }
    
      async findOneExp(name: string): Promise<ExperienceDto> {
        return await this.expModel.findOne({ name: name });
      }
    
      async updateExp(updateExperienceDto: ExperienceDto) {
        let name = updateExperienceDto.name;
        return await this.expModel.findOneAndUpdate({name: name}, updateExperienceDto, {
          new: true,
        });
      }
    
      async removeExp(name: string) {
        return await this.expModel.findOneAndRemove({name: name});
      }
      //========================================================


      //Education Info
      async createEdu(createEducationDto: EducationDto) {
        return await this.eduModel.create(createEducationDto);
      }

      async findAllEdus() {
        return await this.eduModel.find();
      }

      async findOneEdu(name: string): Promise<EducationDto>{
        return await this.eduModel.findOne({ name: name });
      }

      async updateEdu(updateEducationDto: EducationDto){
        let name = updateEducationDto.name;
        return await this.eduModel.findOneAndUpdate({name: name}, updateEducationDto, {new: true});
      }

      async removeEdu(name: string){
        return await this.eduModel.findOneAndRemove({name: name})
      }
      //========================================================


      //Skils Info
      async createSkill(createSkillDto: SkillDto){
        return await this.skillModel.create(createSkillDto);
      }

      async findAllSkills(){
        return await this.skillModel.find();
      }

      async findOneSkill(name: string): Promise<SkillDto>{
        return await this.skillModel.findOne({name: name});
      }

      async updateSkill(updateSkillDto: SkillDto){
        let name = updateSkillDto.name;
        return await this.skillModel.findOneAndUpdate({name: name}, updateSkillDto, {new: true});
      }

      async removeSkill(name: string){
        return await this.skillModel.findOneAndRemove({name: name});
      }
      //========================================================


      //Project info
      createProject(createProjectDto: ProjectDto) {
        return this.projectModel.create(createProjectDto);
      }
    
      findAllProjects() {
        return this.projectModel.find();
      }
    
      findOneProject(name: string): Promise<ProjectDto>{
        return this.projectModel.findOne({name: name});
      }
    
      updateProject(updateProjectDto: ProjectDto) {
        let name = updateProjectDto.name;
        return this.projectModel.findOneAndUpdate({name: name}, updateProjectDto, {new: true});
      }
    
      removeProject(name: string) {
        return this.projectModel.findOneAndRemove({name: name});
      }
      //===========================================================
}
