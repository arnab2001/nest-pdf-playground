export function jsonToTable(json: any) {
  // Extract the "data" property from the JSON object
  const data = json.data;

  // if (!json || !json.data || !Array.isArray(json.data)) {
  //   throw new Error('Invalid JSON structure. "data" property should be an array.');
  // }

  // // Get the keys of the JSON object
  // const keys = Object.keys(data[0]);

  // // Create a table header row
  // const headerRow = keys.map((key) => {
  //   return { text: key, style: { bold: true } };
  // });

  // // Create a table body row for each JSON object
  // const bodyRows = data.map((obj) => {
  //   return keys.map((key) => {
  //     return { text: obj[key] };
  //   });
  // });

  // Return the table
  return data;
  }