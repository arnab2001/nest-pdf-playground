import { Injectable } from '@nestjs/common';
import * as fs from 'fs';


@Injectable()
export class PdfMakeService {
  generateReport() {
    
    return `Report generated successfully at ${new Date().toISOString()}`;
  }
}
