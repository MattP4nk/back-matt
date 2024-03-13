import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InfoService } from 'src/info/info.service';
import { MessageDto } from './dto/message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message, messageDocument } from './schema/message.schema';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class MuseService {
  constructor(
    private readonly httpService: HttpService,
    private infoService: InfoService,
    private authService: AuthService,
    @InjectModel(Message.name) private messageModel: Model<messageDocument>,
  ) {}

  async login(credentials: string = '') {
    let email = credentials.toLowerCase().split('-')[0];
    let password = credentials.split('-')[1];
    let state = 0;
    let response;
    if (email != undefined && password != undefined) {
      let loginData = this.authService.login({
        email: email,
        password: password,
      });
      response =
        'Login successful! Welcome ' +
        (await loginData).user.email +
        '.-' +
        (await loginData).token;
    } else {
      if (email == '') {
        response = 'Please type your email!';
        state = 1;
      } else {
        response = 'Please type your password';
        state = 2;
      }
    }
    return { response: response, state: state };
  }

  async tellAJoke() {
    return await this.httpService.get('https://icanhazdadjoke.com/', {
      headers: { Accept: 'application/json' },
    });
  }

  async askAbout(target: string = '') {
    let area: string = target.split('-')[0];
    let name: string = target.split('-')[1];
    let anwser;
    let names = [];
    let state = 0;
    switch (area) {
      case 'Education':
        try {
          anwser = (await this.infoService.findOneEdu(name)).my_growth;
          state = 0;
        } catch {
          let edus = await this.infoService.findAllEdus();
          edus.forEach((edu) => {
            names.push(edu.name);
          });
          anwser = 'Please especify about which item do you want to know more:';
          names.forEach((name) => {
            anwser += '\n+ ' + name;
          });
          state = 2;
        }
        break;

      case 'Experience':
        try {
          anwser = (await this.infoService.findOneExp(name)).my_growth;
          state = 0;
        } catch {
          let jobs = await this.infoService.findAllExp();
          jobs.forEach((job) => {
            names.push(job.name);
          });
          anwser = 'Please especify about which item do you want to know more:';
          names.forEach((name) => {
            anwser += '\n+ ' + name;
          });
          state = 2;
        }
        break;

      case 'Skills':
        try {
          anwser = (await this.infoService.findOneSkill(name)).thoughts;
          state = 0;
        } catch {
          let skills = await this.infoService.findAllSkills();
          skills.forEach((skill) => {
            names.push(skill.name);
          });
          anwser = 'Please especify about which item do you want to know more:';
          names.forEach((name) => {
            anwser += '\n+ ' + name;
          });
          state = 2;
        }
        break;

      case 'Projects':
        try {
          anwser = (await this.infoService.findOneProject(name)).thoughts;
          state = 0;
        } catch {
          let projects = await this.infoService.findAllProjects();
          projects.forEach((prj) => {
            names.push(prj.name);
          });
          anwser = 'Please especify about which item do you want to know more:';
          names.forEach((name) => {
            anwser += '\n+ ' + name;
          });
          state = 2;
        }
        break;

      case 'Matt':
        anwser = (await this.infoService.findMatt()).about_me;
        state = 0;
        break;

      default:
        anwser =
          'About which area you wanna know more?\n+ Matt\n+ Education\n+ Experience\n+ Skills\n+ Projects';
        state = 1;
        break;
    }
    return { anwser, state };
  }

  saveMessage(message: MessageDto) {
    if (message.sender != undefined && message.message != undefined) {
      this.messageModel.create(message);
      return true;
    } else {
      return false;
    }
  }

  postMessage(details: string) {
    let sender;
    let message;
    if (details != undefined) {
      sender = details.split('-')[0];
      message = details.split('-')[1];
    }
    let state = 0;
    let response;
    if (
      this.saveMessage({
        sender: sender,
        message: message,
        date: Date(),
        read: false,
      }) == false
    ) {
      if (sender == undefined) {
        response = 'Please type your name!';
        state = 1;
      } else {
        response =
          'Now type the message you wanna send, if you can add a way to contact you so I can reply';
        state = 2;
      }
    } else {
      response = 'Message posted!';
    }
    return { response: response, state: state };
  }

  async readMessages(sender: string = '') {
    let response;
    let state = 0;
    try {
      let message = await this.messageModel.findOne({ sender: sender });
      response =
        'Sender: ' +
        message.sender +
        '\nMessage: ' +
        message.message +
        '\nDate: ' +
        message.date +
        '\nRead: ' +
        message.read;
      message.read = true;
      console.log(
        await this.messageModel.findByIdAndUpdate(message._id, message, {
          new: true,
        }),
      );
    } catch {
      let list = await this.messageModel.find();
      if (list.length == 0) {
        response = 'There are no messages';
      } else {
        response = "Please tell me who's message you wanna read:";
        list.forEach((message) => {
          response += '\n>>' + message.sender;
        });
        state = 1;
      }
    }
    return { response: response, state: state };
  }

  async clearReadMessages(sender?: string) {
    let response;
    let state = 0;
    console.log(sender);
    if (sender == 'all') {
      await this.messageModel.deleteMany({ read: true });
      response = 'All read messages where deleted';
    } else {
      if (sender !== undefined) {
        try {
          await this.messageModel.findOneAndDelete({ sender: sender });
          response = 'The message from ' + sender + ' was deleted.';
        } catch {
          response =
            'Message not found. Please check for grammar and try again.';
        }
      } else {
        state = 1;
        let readMessages = await this.messageModel.find({ read: true });
        if (readMessages.length == 0) {
          response = 'There are no read messages to delete.';
        } else {
          response =
            "Please tell me who's read message you wanna delete if not all.";
          readMessages.forEach((message) => {
            response += '\n>> ' + message.sender + '.';
          });
        }
      }
    }
    return { response: response, state: state };
  }
}
