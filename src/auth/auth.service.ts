import { HttpException, Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, userDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { UserDto } from './dto/user.dto';
import { compare, hash } from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Jwt, jwtDocument } from './schema/jwt.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<userDocument>,
    private jwtAuthService: JwtService,
  ) {}
  

  @UseGuards(JwtAuthGuard)
  async register(userDto: UserDto) {
    const { password } = userDto;
    const plainToHash = await hash(password, 10);
    userDto = { ...userDto, password: plainToHash };
    return this.userModel.create(userDto);
  }

  

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const findUser = await this.userModel.findOne({ email: email });
    if (!findUser) throw new HttpException('USER_NOT_FOUND', 404);
    const checkPass = await compare(password, findUser.password);
    if (!checkPass) throw new HttpException('PASSWORD_INCORRECT', 403);
    const payload = { id: findUser._id, role: findUser.role };
    const token = this.jwtAuthService.sign(payload);
    const data = {
      user: findUser,
      token,
    };
    return data;
  }

  async decodeMagicWord(magicWord: string){
    return this.jwtAuthService.decode(magicWord);
  }
}
