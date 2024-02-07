import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { ReportModule } from './report/report.module';
import { PdfMakeService } from './pdf-lib/pdf-lib.service';
import { JspdfModule } from './jspdf/jspdf.module';
import { JsonToPdfModule } from './jsontopdf/jsontopdf.module';
import {JsonToPdfService} from './jsontopdf/jsontopdf.service';
import { DummyModule } from './dummy/dummy.module';

@Module({
  imports: [CatsModule, ReportModule,  JsonToPdfModule, DummyModule],
  controllers: [AppController ],
  providers: [AppService, JsonToPdfService],
  
})


export class AppModule {}
