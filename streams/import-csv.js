import fs from 'node:fs';
import {parse} from 'csv-parse';

const csvURL = new URL('./import.csv', import.meta.url);

const stream = fs.createReadStream(csvURL);

const csvParse = parse({
  delimiter: ',',
  skipEmptyLines: true,
  fromLine: 2
})

async function importCsv(){
  const linesInCsv = stream.pipe(csvParse);

  for await (const line of linesInCsv){
    const [title, description] = line;

    await fetch('http://localhost:3335/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description
      })
    })
  }
}

importCsv();
