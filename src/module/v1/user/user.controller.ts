import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('/users')
export class UserController {
  constructor(private readonly appService: UserService) {}

  @Get('/')
  getUsers() {
    return this.appService.getUsers();
  }

  @Post('/')
  createUser(@Body() userData: CreateUserDto) {
    return this.appService.createUser(userData);
  }
}
