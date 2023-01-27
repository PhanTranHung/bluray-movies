import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('/users')
export class UserController {
  constructor(private readonly appService: UserService) {}

  @Get('/')
  getUsers() {
    return this.appService.getUsers();
  }

  @Post('/')
  createUser() {
    return this.appService.createUser();
  }
}
