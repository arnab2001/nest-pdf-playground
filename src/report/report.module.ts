import { Module } from '@nestjs/common';
import { PdfMakeService } from 'src/pdf-lib/pdf-lib.service';
import { ReportController } from './report.controller';

@Module({
  controllers: [ReportController],
  providers: [PdfMakeService],
})
export class ReportModule {}