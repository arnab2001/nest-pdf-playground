import { Controller, Get, Post, Body } from '@nestjs/common';
import { PdfMakeService } from 'src/pdf-lib/pdf-lib.service';
import { ReportDto } from './dto/report.dto';

@Controller('report')
export class ReportController {
  constructor(private readonly pdfLibService: PdfMakeService) {}

//   @Get()
//   getHello(): string {
//     return this.pdfLibService.getHello();
//   }

  @Get()
  generateReport(@Body() reportDto: ReportDto) {
    return this.pdfLibService.generateReport();
  }
}