import { Controller, Get, Post, Body } from '@nestjs/common';
import { JsonToPdfService } from './jsontopdf.service';

@Controller()
export class JsonToPdfController {
  constructor(private readonly jsonToPdfService: JsonToPdfService) {}

  @Post()
  convertJsonToPdf(@Body() requestBody: { json: any; headerDetails?: any , imageUrls?: any}) {
    if (!requestBody.json) {
      return { message: 'Please provide a JSON object' }; 
    } 

    const { json, headerDetails , imageUrls } = requestBody;
    const outputPath = 'output.pdf';


    this.jsonToPdfService.convertJsonToPdf(
      json,
      outputPath,
      headerDetails,
      imageUrls,
    );
    return { message: 'PDF file generated successfully', json, headerDetails };
  }
  @Get('/hello')
  getHello(): string {
    return 'Hello World! 123';
  }
}
