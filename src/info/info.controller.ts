import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { InfoService } from './info.service';
import { PetitionDto } from './dto/petition.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';

@ApiTags('Info')
@Controller('info')
export class InfoController {
    constructor(private readonly infoService: InfoService, private jwtService: JwtService,){}

    @Post()
    async comunicationsManager(@Res() res, @Body() petitionDto: PetitionDto){
        try {
            switch(petitionDto.request){
                case "get": this.getInfo(res, petitionDto); break;
                case "post": if (this.jwtService.verify(petitionDto.key)) { this.postInfo(res, petitionDto) }; break;
                case "update": if (this.jwtService.verify(petitionDto.key)) { this.updateInfo(res, petitionDto) }; break;
                case "delete": if (this.jwtService.verify(petitionDto.key)) { this.removeInfo(res, petitionDto) }; break
            }
        }    
        catch {
            res
            .status(HttpStatus.FORBIDDEN)
            .json({ message: 'NOT AUTHORIZED' });
        }
    }

    async getInfo(@Res() res, petitionDto: PetitionDto){
        let badREQ = false;
        let response;
        switch(petitionDto.area){
            case "matt":
                switch(petitionDto.target){
                    case 'matt': response = await this.infoService.findMatt(); break;
                }
                break;
            case "experience":
                switch(petitionDto.target){
                    case "all": response = await this.infoService.findAllExp(); break;
                    default: response = await this.infoService.findOneExp(petitionDto.target); break;
                }
                break;
            case "education":
                switch(petitionDto.target){
                    case "all": response = await this.infoService.findAllEdus(); break;
                    default: response = await this.infoService.findOneEdu(petitionDto.target); break;
                }
                break;
            case "skills":
                switch(petitionDto.target){
                    case "all": response = await this.infoService.findAllSkills(); break;
                    default: response = await this.infoService.findOneSkill(petitionDto.target); break;
                }
                break;
            case "projects":
                switch(petitionDto.target){
                    case "all": response = await this.infoService.findAllProjects(); break;
                    default: response = await this.infoService.findOneProject(petitionDto.target); break;
                }
                break;
        }
        if (response == null){badREQ = true}
        if (badREQ){
            res
            .status(HttpStatus.BAD_REQUEST)
            .json({ message: 'Bad Request. Check \"Area\" or \"Target\"', petitionDto });
        }else{
            res
            .status(HttpStatus.OK)
            .json({ message: 'Aproved Request.', response });
        }
    }

    async updateInfo(@Res() res, @Body() petitionDto: PetitionDto){
        let badREQ = false;
        let response;
        switch (petitionDto.area){
            case "matt": response = await this.infoService.updateMatt(petitionDto.aboutPackage); break;
            case "experience": response = await this.infoService.updateExp(petitionDto.expPackage); break;
            case "education": response = await this.infoService.updateEdu(petitionDto.eduPackage); break;
            case "skills":  response = await this.infoService.updateSkill(petitionDto.skillPackage); break;
            case "projects": response = await this.infoService.updateProject(petitionDto.projectPackage); break;  
        }
        if (response == null){badREQ = true}
        if (badREQ){
            res
            .status(HttpStatus.BAD_REQUEST)
            .json({ message: 'Bad Request. Check \"Area\" or \"DTO\"', petitionDto });
        }else{
            res
            .status(HttpStatus.OK)
            .json({ message: 'Aproved changes.', response });
        }

    }
    async postInfo(@Res() res, @Body() petitionDto: PetitionDto){
        let badREQ = false;
        let response;
        switch(petitionDto.area){
            case "experience": response = await this.infoService.createExp(petitionDto.expPackage); break;
            case "education": response = await this.infoService.createEdu(petitionDto.eduPackage); break;
            case "skills": response = await this.infoService.createSkill(petitionDto.skillPackage); break;
            case "projects": response = await this.infoService.createProject(petitionDto.projectPackage); break;
        }

        if (response == null){badREQ = true}
        if (badREQ){
            res
            .status(HttpStatus.BAD_REQUEST)
            .json({ message: 'Bad Request. Check \"Area\" or \"DTO\"', PetitionDto });
        }else{
            res
            .status(HttpStatus.OK)
            .json({ message: 'Item was created', response });
        }
    }
    
    async removeInfo(@Res() res, @Body() petitionDto: PetitionDto){ 
        let badREQ = false;
        let response;
        switch(petitionDto.area){
            case "experience": response = await this.infoService.removeExp(petitionDto.target); break;
            case "education": response = await this.infoService.removeEdu(petitionDto.target); break;
            case "skills": response = await this.infoService.removeSkill(petitionDto.target); break;
            case "projects": response = await this.infoService.removeProject(petitionDto.target); break;
        }
        if (response == null){badREQ = true}
        if (badREQ){
            res
            .status(HttpStatus.BAD_REQUEST)
            .json({ message: 'Bad Request. Check \"Area\" or \"Target\"', PetitionDto });
        }else{
            res
            .status(HttpStatus.OK)
            .json({ message: 'Item Removed.', response });
        }
    }
}
