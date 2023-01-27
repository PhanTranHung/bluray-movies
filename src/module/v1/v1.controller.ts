import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class V1Controller {
  @Get('/')
  getHello(): string {
    return 'Hello from v1 api';
  }
}
