import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InfoService } from 'src/info/info.service';
import { MessageDto } from './dto/message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message, messageDocument } from './schema/message.schema';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';

let workTable;
let workState = 0;
@Injectable()
export class MuseService {
  constructor(
    private readonly httpService: HttpService,
    private infoService: InfoService,
    private authService: AuthService,
    @InjectModel(Message.name) private messageModel: Model<messageDocument>,
  ) {}

  async login(credentials: string = '') {
    async function* logger(credentials?: string) {
      let logginDetails = { email: String, password: String };
      logginDetails.email = yield 'Please type your email!';
      logginDetails.password = yield 'Please type your password';
      return logginDetails;
    }
    switch (workState) {
      case 0:
        workTable = logger();
        workState = 1;
        return workTable.next();
      case 1:
        let control = await workTable.next(credentials);
        if (control.done == false) {
          return await control;
        } else {
          let logginResult = await this.authService.login({
            email: control.value.email,
            password: control.value.password,
          });
          logginResult.user.password = '*********';
          this.cleanState();
          return { value: logginResult };
        }
    }
  }

  async tellAJoke() {
    return await this.httpService.get('https://icanhazdadjoke.com/', {
      headers: { Accept: 'application/json' },
    });
  }

  async askAbout(target: string = '') {
    const infoService = this.infoService;
    async function* asking(question?: string) {
      let area: string;
      let name: string;
      let itemList = '';
      let subjectList;
      do {
        area =
          yield 'Tell me about which area you want to know?\n=>Experience.\n=>Education.\n=>Skills.\n=>Projects.\n=>Matt.';
        do {
          switch (area.toLowerCase()) {
            case 'experience':
              subjectList = await infoService.findAllExp();
              break;
            case 'education':
              subjectList = await infoService.findAllEdus();
              break;
            case 'skills':
              subjectList = await infoService.findAllSkills();
              break;
            case 'projects':
              subjectList = await infoService.findAllProjects();
              break;
            case 'matt':
              return (await infoService.findMatt()).about_me;
            default:
              area =
                yield 'Sorry, check the list above and enter a correct answer';
              break;
          }
        } while (subjectList == undefined);
        subjectList.forEach((subject: any) => {
          itemList += '\n => ' + subject.name;
        });
        name = yield 'Here you have the ' +
          area.toUpperCase() +
          ' section:' +
          itemList +
          '\nPlease tell me about what *Item* do you wish to ask about?';
        try {
          switch (area.toLowerCase()) {
            case 'experience':
              return (await infoService.findOneExp(name)).my_growth;
            case 'education':
              return (await infoService.findOneEdu(name)).my_growth;
            case 'skills':
              return (await infoService.findOneSkill(name)).thoughts;
            case 'projects':
              return (await infoService.findOneProject(name)).thoughts;
            case 'change area':
              subjectList = undefined;
          }
        } catch {
          name = yield "I can't find *" +
            name +
            "*. That item does not exist or I can't find it. Please check the spelling and try again!";
        }
      } while (workState != 2);
      yield;
    }
    switch (workState) {
      case 0:
        workTable = asking();
        workState = 1;
        return workTable.next();
      case 1:
        let control = await workTable.next(target);
        if (control.done == false) {
          return control;
        } else {
          this.cleanState();
          return control;
        }
    }
  }

  postMessage(details: string) {
    function* writer(details?: string) {
      let messageDetails: MessageDto = {
        sender: '',
        message: '',
        date: Date(),
      };
      messageDetails.sender = yield 'Please tell me your name!';
      messageDetails.message =
        yield 'Now type the message you wanna send. If you can, please, add a way for me to contact you so I can reply';
      return messageDetails;
    }

    switch (workState) {
      case 0:
        workTable = writer();
        workState = 1;
        return workTable.next();
      case 1:
        let control = workTable.next(details);
        if (control.done == false) {
          return control;
        } else {
          this.messageModel.create(control.value);
          this.cleanState();
          return { value: 'Message posted' };
        }
    }
  }

  async readMessages(sender?: string) {
    const messageModel = this.messageModel;
    async function* reader(sender?: string) {
      let response;
      let messages = await messageModel.find();
      let messagesList = '';
      if (messages.length == 0) {
        return 'There are no messages';
      } else {
        messages.forEach((message) => {
          messagesList +=
            '\n => Sender: ' + message.sender + '. Read?: ' + message.read;
        });
        let messageToRead =
          yield "Please tell me who's message you wanna read:" + messagesList;
        do {
          try {
            let message = await messageModel.findOne({ sender: messageToRead });
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
            await messageModel.findOneAndUpdate(
              { sender: messageToRead },
              message,
            );
            return response;
          } catch {
            messageToRead =
              yield 'Sorry, check the spelling above and type your answer';
          }
        } while (response == undefined);
      }
    }
    switch (workState) {
      case 0:
        workTable = reader();
        workState = 1;
        return await workTable.next();
      case 1:
        let control = await workTable.next(sender);
        if (control.done == false) {
          return control;
        } else {
          this.cleanState();
          return control;
        }
    }
  }

  cleanState() {
    workState = 0;
    workTable = null;
  }

  async post(data: string) {
    function* contentBuilder(model: {}, reply?: string) {
      let area = reply.toLowerCase();
      let response = model;
      let keys: Array<string> = [];
      Object.entries(model).forEach((key) => {
        keys.push(key[0]);
      });
      for (let i = 0; i < keys.length; ) {
        if (response[keys[i]] != '') {
          if (reply == 'yes') {
            i++;
          } else if (reply == 'no') {
            response[keys[i]] = '';
          } else {
            reply = yield 'please just reply with yes or no.';
          }
        } else {
          reply = yield 'please tell me the ' + keys[i] + ' of the ' + area;
          response[keys[i]] = reply;
          reply = yield 'is * ' +
            keys[i].toUpperCase() +
            ': ' +
            response[keys[i]] +
            ' * correct?';
        }
      }
      return { area, response };
    }
    let model;
    switch (workState) {
      case 0:
        switch (data.toLowerCase()) {
          case 'experience':
            model = { name: '', type: '', details: '', my_growth: '' };
            break;
          case 'education':
            model = { name: '', type: '', details: '', my_growth: '' };
            break;
          case 'skill':
            model = {
              name: '',
              type: '',
              knowledge: '',
              detail: '',
              thoughts: '',
              growt: '',
            };
            break;
          case 'project':
            model = { name: '', URL: '', details: '', thoughts: '' };
            break;
          default:
            return {
              value:
                'Please tell me what area are we working on: \n+Experience\n+Education\n+Skill\n+Projects',
            };
        }
        workTable = contentBuilder(model, data);
        workState = 1;
        return workTable.next();
      case 1:
        let control = workTable.next(data);
        if (control.done == false) {
          return control;
        } else {
          this.cleanState();
          switch (control.value.area) {
            case 'experience':
              return this.infoService.createExp(control.value.response);
            case 'education':
              return this.infoService.createEdu(control.value.response);
            case 'skill':
              return this.infoService.createSkill(control.value.response);
            case 'project':
              return this.infoService.createProject(control.value.response);
          }
        }
    }
  }

  async update(data: string) {
    const infoService = this.infoService;
    async function* contentUpdater() {
      let area: string;
      let name: string;
      let nameList = '';
      let itemList;
      let item;
      let done = false;
      do {
        area =
          yield 'Tell me in which area you want to work?\n=>Experience.\n=>Education.\n=>Skills.\n=>Projects.\n=>Matt.';
        do {
          switch (area.toLowerCase()) {
            case 'experience':
              itemList = await infoService.findAllExp();
              break;
            case 'education':
              itemList = await infoService.findAllEdus();
              break;
            case 'skills':
              itemList = await infoService.findAllSkills();
              break;
            case 'projects':
              itemList = await infoService.findAllProjects();
              break;
            case 'matt':
              item = await infoService.findMatt();
              break;
            default:
              area =
                yield 'Sorry, check the list above and enter a correct answer';
              break;
          }
        } while (itemList == undefined && item == undefined);
        if (area.toLowerCase() != 'matt') {
          itemList.forEach((item: any) => {
            nameList += '\n => ' + item.name;
          });
          name = yield 'Here you have the ' +
            area.toUpperCase() +
            ' section:' +
            nameList +
            '\nPlease tell me what *Item* do you wish to update?';
          do {
            itemList.forEach((it) => {
              if (it.name == name) {
                item = it;
              }
            });
            if (item == undefined) {
              name = yield "I can't find *" +
                name +
                "*. That item does not exist or I can't find it. Please check the spelling and try again!";
            }
          } while (item == undefined);
        }
        do {
          let fieldList = 'AREA:  ' + area.toUpperCase();
          Object.entries(item._doc).forEach((field) => {
            if (field[0] != '_id' && field[0] != '__v') {
              fieldList += '\n ==>' + field[0].toUpperCase() + ':  ' + field[1];
            }
          });
          let field = yield 'Here:' +
            fieldList +
            '\n Tell me the field to update.';
          item[field] = yield 'Give me the updated version of ' + field + '.';
          let yesNo = true;
          let confirmation = yield 'The updated *' +
            field.toUpperCase() +
            '* is *' +
            item[field] +
            '* do you want to continue updating this item?';
          do {
            switch (confirmation.toLowerCase()) {
              case 'yes':
                yesNo = false;
                break;
              case 'no':
                switch (area) {
                  case 'experience':
                    await infoService.updateExp(item);
                    break;
                  case 'education':
                    await infoService.updateEdu(item);
                    break;
                  case 'skills':
                    await infoService.updateSkill(item);
                    break;
                  case 'projects':
                    await infoService.updateProject(item);
                    break;
                  case 'matt':
                    await infoService.updateMatt(item);
                    break;
                }
                yesNo = false;
                done = true;
                break;
              default:
                confirmation = yield 'Please just "yes" or "no" answers!';
                break;
            }
          } while (yesNo);
        } while (!done);
        let yesNo = true;
        let confirmation = yield 'Do you wish to keep updating this porfolio?';
        do {
          switch (confirmation) {
            case 'yes':
              yesNo = false;
              break;
            case 'no':
              yesNo = false;
              workState = 2;
              break;
            default:
              confirmation = yield 'Please just "yes" or "no" answers!';
              break;
          }
        } while (yesNo);
      } while (workState != 2);
      return 'Updating is done!';
    }
    switch (workState) {
      case 0:
        workTable = contentUpdater();
        workState = 1;
        return workTable.next();
      case 1:
        let control = await workTable.next(data);
        if (control.done == false) {
          return control;
        } else {
          this.cleanState();
          return control;
        }
    }
  }

  async delete(data: string) {
    const infoService = this.infoService;
    async function* contentEraser() {
      let area: string;
      let name: string;
      let nameList = '';
      let itemList;
      let item;
      do {
        area =
          yield 'Tell me in which area you want to work?\n=>Experience.\n=>Education.\n=>Skills.\n=>Projects.';
        do {
          switch (area.toLowerCase()) {
            case 'experience':
              itemList = await infoService.findAllExp();
              break;
            case 'education':
              itemList = await infoService.findAllEdus();
              break;
            case 'skills':
              itemList = await infoService.findAllSkills();
              break;
            case 'projects':
              itemList = await infoService.findAllProjects();
              break;
            default:
              area =
                yield 'Sorry, check the list above and enter a correct answer';
              break;
          }
        } while (itemList == undefined && item == undefined);
        itemList.forEach((item: any) => {
          nameList += '\n => ' + item.name;
        });
        name = yield 'This is the *' +
          area.toUpperCase() +
          '* section:' +
          nameList +
          '\nPlease tell me what *Item* do you wish to delete?';
        do {
          itemList.forEach((it) => {
            if (it.name == name) {
              item = it;
            }
          });
          if (item == undefined) {
            name = yield "I can't find *" +
              name +
              "*. That item does not exist or I can't find it. Please check the spelling and try again!";
          }
        } while (item == undefined);
        let yesNo = true;
        let confirmation = yield 'We will delete *' +
          item.name +
          '*. Do you want to delete this item?';
        do {
          switch (confirmation.toLowerCase()) {
            case 'no':
              yesNo = false;
              break;
            case 'yes':
              switch (area) {
                case 'experience':
                  await infoService.removeExp(item.name);
                  break;
                case 'education':
                  await infoService.removeEdu(item.name);
                  break;
                case 'skills':
                  await infoService.removeSkill(item.name);
                  break;
                case 'projects':
                  await infoService.removeProject(item.name);
                  break;
              }
              yesNo = false;
              break;
            default:
              confirmation = yield 'Please just "yes" or "no" answers!';
              break;
          }
        } while (yesNo);
        yesNo = true;
        confirmation = yield 'Do you wish to delete another item?';
        do {
          switch (confirmation.toLowerCase()) {
            case 'yes':
              nameList = "";
              yesNo = false;
              break;
            case 'no':
              yesNo = false;
              workState = 2;
              break;
            default:
              confirmation = yield 'Please just "yes" or "no" answers!';
              break;
          }
        } while (yesNo);
      } while (workState != 2);
      return 'We are done!';
    }

    switch (workState) {
      case 0:
        workTable = contentEraser();
        workState = 1;
        return workTable.next();
      case 1:
        let control = await workTable.next(data);
        if (control.done == false) {
          return control;
        } else {
          this.cleanState();
          return control;
        }
    }
  }

  async clearReadMessages(target?: string) {
    const messageModel = this.messageModel;
    async function* cleaner(target?: string) {
      let messages = await messageModel.find();
      let messagesList = '';
      if (messages.length == 0) {
        return 'There are no messages to clear';
      }
      messages.forEach((message) => {
        messagesList +=
          '\n => Sender: ' + message.sender + '. Read?: ' + message.read;
      });
      target =
        yield 'Please tell me which message to delete or type *all* to delete all read messages.' +
          messagesList;

      do {
        if (target.toLowerCase() == 'all') {
          await messageModel.deleteMany({ read: true });
          return 'All read messages where deleted';
        } else {
          try {
            await this.messageModel.findOneAndDelete({ sender: target });
            return 'The message from ' + target + ' was deleted.';
          } catch {
            target =
              yield 'Message not found. Please check the spelling and try again.';
          }
        }
      } while (true);
    }
    switch (workState) {
      case 0:
        workTable = cleaner();
        workState = 1;
        return await workTable.next();
      case 1:
        let control = await workTable.next(target);
        if (control.done == false) {
          return control;
        } else {
          this.cleanState();
          return control;
        }
    }
  }
}
