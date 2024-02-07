import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

import { TDocumentDefinitions } from 'pdfmake/interfaces';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

@Injectable()
export class PdfMakeService {
  generateReport() {
    
    return `Report generated successfully at ${new Date().toISOString()}`;
  }
}
