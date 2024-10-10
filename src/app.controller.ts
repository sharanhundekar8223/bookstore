import { Controller, Get, Headers } from '@nestjs/common';
@Controller()
export class AppController {
  constructor() {}

  @Get('/')
  home(@Headers('urc') urc: string) {
    return 'Success from server';
  }
}
