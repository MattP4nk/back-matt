import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './schema/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { jwtConst } from './jwt.const';
import { Jwt, jwtSchema } from './schema/jwt.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: userSchema,
      },
      {
        name: Jwt.name,
        schema: jwtSchema
      },
    ]),
    JwtModule.register({
      global: true,
      secret: jwtConst.secret, //Not the best, I know.
      signOptions: { expiresIn: '5h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
