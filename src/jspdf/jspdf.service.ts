import { Injectable } from '@nestjs/common';

@Injectable()
export class JsonToPdfService {
//   async convertJsonToPdf(json: any): Promise<Buffer> {
//     const doc = new Document();

//     // Add a new page to the document
//     const page = await doc.addPage();

//     // Set the font for the table
//     page.setFont(StandardFonts.Helvetica);

//     // Get the keys of the JSON object
//     const keys = Object.keys(json);

//     // Create a table with the JSON data
//     const table = page.createTable(keys.length + 1, json[keys[0]].length + 1);

//     // Set the table header
//     table.setHeader([
//       { text: 'Key', fontSize: 10 },
//       ...json[keys[0]].map((value: any) => ({ text: value, fontSize: 10 })),
//     ]);

//     // Set the table data
//     for (let i = 0; i < keys.length; i++) {
//       const row = [
//         { text: keys[i], fontSize: 10 },
//         ...json[keys[i]].map((value: any) => ({ text: value, fontSize: 10 })),
//       ];
//       table.addRow(row);
//     }

//     // Draw the table
//     await table.draw();

//     // Save the PDF document to a buffer
//     const pdfBuffer = await doc.save();

//     return pdfBuffer;
  //}
}