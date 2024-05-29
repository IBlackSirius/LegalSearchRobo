import fs from 'fs';
import iconv from "iconv-lite";
import listFolder from './listFolder.mjs'
import { load } from 'cheerio'
import { rm } from 'node:fs/promises'

const tableToCSV = async (tableHTML, name, headersService = '', searchParams = '', currentService) => {
  const pathFolder = `temporaries/${currentService}`;
  const file = listFolder(pathFolder).find(csvName => csvName.includes(name.split("_createdBy=")[0]))
  if (fs.existsSync(`${pathFolder}/${file}`)) {
    console.log('Deletando o arquivo repetido',`${pathFolder}/${file}`);
    await rm(`${pathFolder}/${file}`, { recursive: true }, (err) => {
      if (err) {
        console.error('Erro ao deletar a pasta:', err);
        return;
      }
    });
  }

  const $ = load(tableHTML);

  const rows = $('tr').toArray();

  const headers = $(rows[0]).find('td').map((_, td) => $(td).text().trim()).get();

  rows.shift();

  let csv = headersService + headers.join(';') + '\n';

  rows.forEach(row => {
    const rowData = $(row).find('td').map((_, td) => $(td).text().trim()).get();
    csv += searchParams + rowData.join(';') + '\n';
  });

  const csvBuffer = iconv.encode(csv, 'utf-8');

  await fs.promises.writeFile(`temporaries/${currentService}/${name}.csv`, csvBuffer);
};

export default tableToCSV