import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UserDto } from './dto/user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Res() res, @Body() userDto: UserDto) {
    //Validations
    if (
      userDto.email.length == 0 ||
      userDto.password.length == 0 ||
      userDto.role.length == 0
    ) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'One or more fields are empty', userDto });
    }
    const response = await this.authService.register(userDto);
    console.log('step 5');
    res.status(HttpStatus.OK).json({ message: 'User created.', response });
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}