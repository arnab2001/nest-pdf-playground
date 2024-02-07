import { Controller, Get, Post, Body } from '@nestjs/common';
import { JsonToPdfService } from './jsontopdf.service';
import { get } from 'http';

@Controller()
export class JsonToPdfController {
  constructor(private readonly jsonToPdfService: JsonToPdfService) {}

  @Post()
  convertJsonToPdf(@Body() requestBody: { json: any, headerDetails?: any }) {
    const { json, headerDetails } = requestBody;
    const outputPath = 'output.pdf';
  
    this.jsonToPdfService.convertJsonToPdf(json, outputPath, headerDetails);
    return { message: 'PDF file generated successfully',json, headerDetails};
  }
    @Get("/hello")
    getHello(): string {
      return 'Hello World!';
    }
}