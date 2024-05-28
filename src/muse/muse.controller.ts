import { Controller, Post, Body, Res, HttpStatus, Get } from '@nestjs/common';
import { MuseService } from './muse.service';
import { Comms } from './dto/comms.dto';
import { JwtService } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Muse')
@Controller('muse')
export class MuseController {
  constructor(private readonly museService: MuseService, private jwtService: JwtService,) {}

  @Post("/test")
  test(@Body() body){
    return this.museService.post(body.data)
  }

  @Post()
  async museComms(@Res() res, @Body() newComm: Comms) {
    let badREQ = false;
    let response;
    let currentTask = '';
    let comms;
    let message;
    switch (newComm.command) {

      case 'login':
        comms = (await this.museService.login(newComm.message));
        if (comms.done == false){currentTask = newComm.command}
        response = comms.value;
        break;

      case 'help':
        response = 
                  `This is a list of commands you can use on this chatbot
                  \n+ help: Return this list.
                  \n+ ask: Gives more info about an item of this porfolio.
                  \n+ joke: Returns a random generated joke.
                  \n+ message: Posts a message.
                  \n+ login: Login into the sistem.
                  \n+ clear: Clears console.
                  \n+ cancel: Cancels current task.
                  \n+ read: Shows all posted messages -needs key-.
                  \n+ clearMessages: Clear read messages -needs key-.
                  \n+ post: Posts new info -needs key-.
                  \n+ update: Updates info -needs key-.
                  \n+ future: Return a list of future implementations.
                  `;
                  //      
      break;

      case "clearMessages":
        try{
          this.jwtService.verify(newComm.key)
          comms = await this.museService.clearReadMessages(newComm.message);
          response = comms.value;
          if (comms.done == false) { currentTask = newComm.command }
        }catch{
          response = "You don't have authorization to access this resource"
        }
      break;

      case "post":
        try{
          this.jwtService.verify(newComm.key)
          comms = await this.museService.post(newComm.message);
          response = comms.value;
          if (comms.done == false){currentTask = newComm.command}
        }catch{
          response = "You don't have authorization to access this resource"
        }
      break;

      case 'read':
        try {
          this.jwtService.verify(newComm.key)
          console.log("passed key")
          comms = (await this.museService.readMessages(newComm.message));
          console.log(comms)
          response = comms.value;
          if (comms.done == false) { currentTask = newComm.command }
        }
        catch{
          response = "You don't have authorization to access this resource"
        }
        break;

      case 'ask':
        comms = (await this.museService.askAbout(newComm.message));
        response = comms.value;
        if (comms.done == false){currentTask = newComm.command}
        break;

      case 'message':
        message = (await this.museService.postMessage(newComm.message));
        if (comms.done == false){currentTask = newComm.command}
        response = message.value;
        break;

      case 'joke':
        (await this.museService.tellAJoke()).subscribe((joke) => {
          res.status(HttpStatus.OK).json({ message: 'Sure!', response: joke.data.joke, currentTask: "" });});
          return;
      
      case 'future':
          response = 'I\'m working in adding updating and posting new info directly from Muse.'
      break

      default:
        response = "Bad Request! Please only use an available command! You can type help for more information!"
    }
    if (response == null){badREQ = true}
    if (badREQ){
        res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Sorry, can\'t do!', newComm });
    }else{
        res
        .status(HttpStatus.OK)
        .json({ message: 'Sure!', response: response, currentTask: currentTask });
    }
  }
}
