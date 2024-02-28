import { Injectable } from '@nestjs/common';
import { createWriteStream } from 'fs';
import * as PDFKit from 'pdfkit';
import axios from 'axios';

interface JsonTable {
  headers: string[];
  rows: any[][];
}

interface HeaderDetails {
  creationDate?: string;
  name?: string;
  labName?: string;
  device?: string;
  topology?: string;
  vinmin?: string;
}

@Injectable()
export class JsonToPdfService {
  async convertJsonToPdf(
    json: JsonTable,
    outputPath: string,
    headerDetails?: HeaderDetails,
    imageUrls?: string[], 
  ): Promise<void> {
    const doc = new PDFKit({
      size: 'A4',
      layout: 'portrait',
      info: { Title: 'My PDF Document' },
      //set bottom margin:
      margin: 20,
    });
 
    doc.pipe(createWriteStream(outputPath));

    const tableWidth = 500;
    const colWidth = tableWidth / json.headers.length;
    const rowHeight = 20;
    const maxRowsPerPage = 25;
    const imageWidth = 200;
    const imageHeight = 200;

    const headerHeight = headerDetails ? 70 : 0;

    // Footer text
    const footerText = `WEBENCH® Design Report LM5176PWPR : LM5176PWPR 9V-54V to 12.00V `;

    const renderFooter = () => {
      doc
        .fontSize(10)
        .text(footerText, doc.page.margins.left / 2, 750, { align: 'center' });
    };

    const renderPageFooter = () => {
      // Do not call renderFooter here to avoid recursion
    };

    // Add the following line to set up the 'pageAdded' event listener
    doc.on('pageAdded', renderPageFooter);
    //print footer on every page
    doc.on('pageAdded', renderFooter);
    ////////////////////////////////////////////////////////////////////

    //////////////////////

    const renderHeader = async () => {
      if (headerDetails) {
        try {
          const logoUrl =
            'https://www.creowis.com/_next/image?url=%2Fimages%2Fcompany%2Flogo.png&w=1920&q=75';
          const logoResponse = await axios.get(logoUrl, {
            responseType: 'arraybuffer',
          });
          const logoBuffer = Buffer.from(logoResponse.data, 'binary');

          doc.image(logoBuffer, 30, 20, { width: 50, height: 30 });
          doc.fontSize(12).text(` ${'CreoWis'}`, 30, 50);

          doc
            .fontSize(12)
            .text( 
              `Creation Date: ${headerDetails.creationDate || ''}`,
              100,
              30,
            );
          doc.fontSize(16).text(`Name: ${headerDetails.name || ''}`, 100, 50);
          doc
            .fontSize(14)
            .text(`Lab Name: ${headerDetails.labName || ''}`, 100, 70);

          doc
            .fontSize(12)
            .text(`Device: ${headerDetails.device || ''}`, 400, 30);
          doc
            .fontSize(12)
            .text(`Topology: ${headerDetails.topology || ''}`, 400, 50);
          doc
            .fontSize(12)
            .text(`VinMin: ${headerDetails.vinmin || ''}`, 400, 70);
        } catch (error) {
          console.error(`Error fetching logo: ${error.message}`);
        }
      }
    };

    //add a single image of whole width
    const renderImage = async () => {
      try {
        const imageUrl =
          'https://favoland-dev.s3.eu-north-1.amazonaws.com/products/circuit1.jpg';
        const response = await axios.get(imageUrl, {
          responseType: 'arraybuffer',
        });
        const imageBuffer = Buffer.from(response.data, 'binary');
        doc.image(imageBuffer, 30, 100, { width: 500, height: 300 });
      } catch (error) {
        console.error(`Error fetching image ${imageUrls[0]}: ${error.message}`);
      }
    };

    renderHeader();
    renderImage();

    const tableX = (doc.page.width - tableWidth) / 2;

    const calculateImageSpace = (imageCount: number): number => {
      const imageGridCols = 2;
      const imageGridSpacing = 15;
      const rowsNeeded = Math.ceil(imageCount / imageGridCols);
      return rowsNeeded * (imageHeight + imageGridSpacing);
    };

    const imageSpace = calculateImageSpace(imageUrls.length);

    let currentRow = 0;
    let currentPage = 0;

    if (imageUrls && imageUrls.length > 0) {
      if (doc.y + imageSpace > doc.page.height) {
        doc.addPage();
        currentRow = 0;
        currentPage++;
      }

      for (let i = 0; i < imageUrls.length; i++) {
        const imageUrl = imageUrls[i];

        try {
          const response = await axios.get(imageUrl, {
            responseType: 'arraybuffer',
          });
          const imageBuffer = Buffer.from(response.data, 'binary');

          const gridCol = i % 2;
          const gridRow = Math.floor(i / 2);

          const imageX =
            tableX +
            (doc.page.width - tableWidth) / 2 +
            gridCol * (imageWidth + 10);

          const imageY = doc.y + gridRow * (imageHeight + 10) + 10;

          doc.image(imageBuffer, imageX, imageY, {
            fit: [imageWidth, imageHeight],
            align: 'center',
            valign: 'bottom',
          });
        } catch (error) {
          console.error(`Error fetching image ${imageUrl}: ${error.message}`);
        }

        if (
          i === imageUrls.length - 1 ||
          (i + 1) % (2 * maxRowsPerPage) === 0
        ) {
          doc.addPage();
          currentRow = 0;
          currentPage++;
        }
      }

      doc.moveDown((imageSpace / doc.page.height) * doc.page.height);
    }

    const renderColumnHeaders = (isFirstPage: boolean) => {
      json.headers.forEach((header, i) => {
        doc
          .text(header, tableX + i * colWidth, 50 + headerHeight)
          .rect(tableX + i * colWidth, 50 + headerHeight, colWidth, rowHeight)
          .stroke();
      });
    };

    renderColumnHeaders(true);
    const checkRemainingSpace = () => {
      const remainingSpace =
        doc.page.height - (50 + headerHeight + currentRow * rowHeight);
      return remainingSpace >= rowHeight;
    };

    json.rows.forEach((row, rowIndex) => {
      if (currentRow >= maxRowsPerPage || !checkRemainingSpace()) {
        doc.addPage();
        renderColumnHeaders(true);
        currentRow = 0;
        currentPage++;
      }

      row.forEach((cell, colIndex) => {
        doc
          .text(
            cell.toString(),
            tableX + colIndex * colWidth,
            50 + headerHeight + (currentRow + 1) * rowHeight,
          )
          .rect(
            tableX + colIndex * colWidth,
            50 + headerHeight + (currentRow + 1) * rowHeight,
            colWidth,
            rowHeight,
          )
          .stroke();
      });

      currentRow++;
    });

    doc.end();
  }
}
