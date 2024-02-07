import { Body, Controller, Get,Post } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('cats')
export class AppController {
  
  @Get()
  getHello(): string {
    return 'this returns a list of cats';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This returns a #${id} cat`;
  }

 
}