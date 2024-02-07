import { Injectable } from '@nestjs/common';
import { createWriteStream } from 'fs';
import * as PDFKit from 'pdfkit';
import { jsonToTable } from './jsonToTable';

interface JsonTable {
  headers: string[];
  rows: any[][];
}

interface HeaderDetails {
  creationDate?: string;
  name?: string;
  labName?: string;
}

@Injectable()
export class JsonToPdfService {
  convertJsonToPdf(json: JsonTable, outputPath: string, headerDetails?: HeaderDetails): void {
    const doc = new PDFKit({
      size: 'A4',
      layout: 'portrait',
      info: { Title: 'My PDF Document' },
    });

    doc.pipe(createWriteStream(outputPath));

    const tableWidth = 500;
    const colWidth = tableWidth / json.headers.length;
    const rowHeight = 20;
    const maxRowsPerPage = 25; // Adjust this value based on your needs

    // Calculate the height of the header
    const headerHeight = headerDetails ? 70 : 0;
    const renderHeader = () => {
      if (headerDetails) {
        doc.fontSize(12).text(`Creation Date: ${headerDetails.creationDate || ''}`, 50, 30);
        doc.fontSize(16).text(`Name: ${headerDetails.name || ''}`, 50, 50);
        doc.fontSize(14).text(`Lab Name: ${headerDetails.labName || ''}`, 50, 70);
      }
    };
    // Center-align the table
    const tableX = (doc.page.width - tableWidth) / 2;
    renderHeader(); 
    // Function to add a new page
    const addNewPage = () => {
      doc.addPage();
      // Render header details on every new page
      renderColumnHeaders(); // Render column headers on every new page
      currentRow = 0;
      currentPage++;
    };

    // Function to render header details
    

    // Function to render column headers
    const renderColumnHeaders = () => {
      json.headers.forEach((header, i) => {
        doc.text(header, tableX + i * colWidth, 50 + headerHeight).rect(tableX + i * colWidth, 50 + headerHeight, colWidth, rowHeight).stroke();
      });
    };

    let currentRow = 0;
    let currentPage = 1;

    // Initial rendering of header and column headers on the first page
    renderHeader();
    renderColumnHeaders();

    // Function to check remaining space on the page
    const checkRemainingSpace = () => {
      const remainingSpace = doc.page.height - (50 + headerHeight + currentRow * rowHeight);
      return remainingSpace >= rowHeight;
    };

    // Add the table content
    json.rows.forEach((row, rowIndex) => {
      if (currentRow >= maxRowsPerPage || !checkRemainingSpace()) {
        addNewPage();
      }
      row.forEach((cell, colIndex) => {
        doc
          .text(cell.toString(), tableX + colIndex * colWidth, 50 + headerHeight + (currentRow + 1) * rowHeight)
          .rect(tableX + colIndex * colWidth, 50 + headerHeight + (currentRow + 1) * rowHeight, colWidth, rowHeight)
          .stroke();
      });
      currentRow++;
    });

    // Finalize the PDF document
    doc.end();
  }
}
