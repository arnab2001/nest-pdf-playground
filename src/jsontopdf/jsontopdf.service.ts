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
    });

    doc.pipe(createWriteStream(outputPath));

    const tableWidth = 500;
    const colWidth = tableWidth / json.headers.length;
    const rowHeight = 20;
    const maxRowsPerPage = 25;
    const imageWidth = 200;
    const imageHeight = 200;

    const headerHeight = headerDetails ? 70 : 0;

    // const renderHeader = async () => {
    //   if (headerDetails) {

    //     try {
    //       const logoUrl = 'https://www.creowis.com/_next/image?url=%2Fimages%2Fcompany%2Flogo.png&w=1920&q=75'; // Replace with the URL of your logo
    //       const logoResponse = await axios.get(logoUrl, { responseType: 'arraybuffer' });
    //       const logoBuffer = Buffer.from(logoResponse.data, 'binary');
    //       doc.image(logoBuffer, 50, 20, { width: 50, height: 50 });
    
    //     } catch (error) {
    //       console.error(`Error fetching logo: ${error.message}`);
    //     }

        

    //     doc.fontSize(12).text(`Creation Date: ${headerDetails.creationDate || ''}`, 50, 30);
    //     doc.fontSize(16).text(`Name: ${headerDetails.name || ''}`, 50, 50);
    //     doc.fontSize(14).text(`Lab Name: ${headerDetails.labName || ''}`, 50, 70);
    //   }
    // };
    const footerText = 'Your One-Line Footer Text Here';
    const renderFooter = () => {
      doc
        .fontSize(10)
        .text(footerText, doc.page.margins.left, doc.page.height - (doc.page.height+100), {
          align: 'left',
        });
    };
    const renderHeader = async () => {
      if (headerDetails) {
        // Add your logo image
        try {
          const logoUrl = 'https://www.creowis.com/_next/image?url=%2Fimages%2Fcompany%2Flogo.png&w=1920&q=75'; // Replace with the URL of your logo
          const logoResponse = await axios.get(logoUrl, { responseType: 'arraybuffer' });
          const logoBuffer = Buffer.from(logoResponse.data, 'binary');
    
          // // Adjust the position of the logo to the top-left corner
          // doc.image(logoBuffer, 50, 20, { width: 50, height: 30 });
        } catch (error) {
          console.error(`Error fetching logo: ${error.message}`);
        }
    
        // Position the text to the right of the logo
        // doc.fontSize(12).text(` ${'CreoWis'}`, 50, 90);
        doc.fontSize(12).text(`Creation Date: ${headerDetails.creationDate || ''}`, 120, 30);
        doc.fontSize(16).text(`Name: ${headerDetails.name || ''}`, 120, 50);
        doc.fontSize(14).text(`Lab Name: ${headerDetails.labName || ''}`, 120, 70);


        //Right side headers
        doc.fontSize(12).text(`Device: ${headerDetails.device || ''}`, 400, 30);
        doc.fontSize(12).text(`Topology: ${headerDetails.topology || ''}`, 400, 50);
        doc.fontSize(12).text(`VinMin: ${headerDetails.vinmin || ''}`, 400, 70);

      }
      
    };

    renderHeader();

    const tableX = (doc.page.width - tableWidth) / 2;

    // Function to calculate the space required for images
    const calculateImageSpace = (imageCount: number): number => {
      const imageGridCols = 2; // Number of columns in the image grid
      const imageGridSpacing = 10; // Spacing between images in the grid
      const rowsNeeded = Math.ceil(imageCount / imageGridCols);
      return rowsNeeded * (imageHeight + imageGridSpacing);
    };

    const imageSpace = calculateImageSpace(imageUrls.length);

    let currentRow = 0;
    let currentPage = 0;

    // Check if images are provided
    if (imageUrls && imageUrls.length > 0) {
      // Start rendering images on a new page if needed
      if (doc.y + imageSpace > doc.page.height) {
        doc.addPage();
        currentRow = 0;
        currentPage++;
      }

      // for (let i = 0; i < imageUrls.length; i++) {
      //   const imageUrl = imageUrls[i];

      //   try {
      //     const response = await axios.get(imageUrl, {
      //       responseType: 'arraybuffer',
      //     });
      //     const imageBuffer = Buffer.from(response.data, 'binary');

      //     const gridCol = i % 2; // Assuming 2 columns in the image grid
      //     const gridRow = Math.floor(i / 2);

      //     doc.image(
      //       imageBuffer,
      //       tableX + gridCol * (imageWidth + 10), // Adjusted x-coordinate with spacing
      //       doc.y + gridRow * (imageHeight + 10) + 10, // Adjusted y-coordinate with spacing
      //       {
      //         fit: [imageWidth, imageHeight],
      //         align: 'center',
      //         valign: 'bottom',
      //       },
      //     );
      //   } catch (error) {
      //     console.error(`Error fetching image ${imageUrl}: ${error.message}`);
      //   }

      //   // Check if more images on next page
      //   if (i === imageUrls.length - 1 || (i + 1) % (2 * maxRowsPerPage) === 0) {
      //     doc.addPage();
      //     currentRow = 0;
      //     currentPage++;
      //   }
      // }


      for (let i = 0; i < imageUrls.length; i++) {
        const imageUrl = imageUrls[i];
      
        try {
          const response = await axios.get(imageUrl, {
            responseType: 'arraybuffer',
          });
          const imageBuffer = Buffer.from(response.data, 'binary');
      
          const gridCol = i % 2; // Assuming 2 columns in the image grid
          const gridRow = Math.floor(i / 2);
      
          const imageX = tableX + (doc.page.width - tableWidth) / 2 + // Center the image horizontally
            gridCol * (imageWidth + 10); // Adjusted x-coordinate with spacing
      
          const imageY = doc.y + gridRow * (imageHeight + 10) + 10; // Adjusted y-coordinate with spacing
      
          doc.image(
            imageBuffer,
            imageX,
            imageY,
            {
              fit: [imageWidth, imageHeight],
              align: 'center', // Center align the image
              valign: 'bottom',
            },
          );
        } catch (error) {
          console.error(`Error fetching image ${imageUrl}: ${error.message}`);
        }
      
        // Check if more images on the next page
        if (i === imageUrls.length - 1 || (i + 1) % (2 * maxRowsPerPage) === 0) {
          doc.addPage();
          currentRow = 0;
          currentPage++;
        }
      }

      // Move to the space below the images
      doc.moveDown((imageSpace / doc.page.height) * doc.page.height);
    }

    const renderColumnHeaders = (isFirstPage: boolean) => {
      if (!isFirstPage) {
        json.headers.forEach((header, i) => {
          doc
            .text(header, tableX + i * colWidth, 50 + headerHeight)
            .rect(tableX + i * colWidth, 50 + headerHeight, colWidth, rowHeight)
            .stroke();
        });
      } else {
        json.headers.forEach((header, i) => {
          doc
            .text(header, tableX + i * colWidth, 50 + headerHeight)
            .rect(tableX + i * colWidth, 50 + headerHeight, colWidth, rowHeight)
            .stroke();
        });
      }
    };
    // Render table
  

    renderColumnHeaders(false);
    const checkRemainingSpace = () => {
      const remainingSpace = 
        doc.page.height - (50 + headerHeight + currentRow * rowHeight);
      return remainingSpace >= rowHeight;
    };

    json.rows.forEach((row, rowIndex) => {
      if (currentRow >= maxRowsPerPage || !checkRemainingSpace()) {
        doc.addPage();

        renderColumnHeaders(false);
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


    if(footerText){
      renderFooter();
    }

    doc.end();
  }
}
