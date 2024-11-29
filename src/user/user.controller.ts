import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { compare, genSalt, hash } from 'bcryptjs';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { generateJwtToken } from 'src/utils/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { Public } from 'src/auth/decorators/public';
import { User } from './entities/user.entity';
import { CurrentUser } from 'src/auth/decorators/current-user';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      const user = await this.userService.findOne({
        email: createUserDto.email,
      });

      if (user) {
        throw new Error('User already exist with this email address');
      }

      const hashPassword = await hash(createUserDto.password, await genSalt());

      const createUser = await this.userService.create({
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashPassword,
        role: createUserDto.role,
      });

      const jwtToken = await generateJwtToken({
        id: createUser.id,
        email: createUser.email,
      });

      res.cookie('access_token', jwtToken.token, {
        maxAge: 24 * 60 * 60 * 1000,
        path: '/',
        domain: 'localhost',
      });

      return res.send({ user: createUser, token: jwtToken.token });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Public()
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    try {
      const user = await this.userService.findOne({
        email: loginUserDto.email,
      });

      if (!user) {
        throw new Error('User not found');
      }

      const isPasswordMatched = await compare(
        loginUserDto.password,
        user.password,
      );

      if (!isPasswordMatched) {
        throw new Error('Password not matched');
      }

      const jwtToken = await generateJwtToken({
        id: user.id,
        email: user.email,
      });

      res.cookie('access_token', jwtToken.token, {
        maxAge: 24 * 60 * 60 * 1000,
        path: '/',
        domain: 'localhost',
      });

      return res.send({ user, token: jwtToken.token });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('me')
  findOne(@CurrentUser() user: User) {
    return this.userService.findOne({ id: user.id });
  }
}
