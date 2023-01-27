import { Controller, Get } from '@nestjs/common';

@Controller('/v1')
export class V1Controller {
  @Get('/')
  getHello(): string {
    return 'Hello from v1 api';
    // return this.appService.findOne();
  }
}
