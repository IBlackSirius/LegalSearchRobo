import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'

import listFolder from './listFolder.mjs'

const joinCSVs = async (files) => {
  let data
  try {
    for (let i = 0; i < files.length; i++) {
      const arquivo = files[i];

      if (i == 0) {
        data = await readCsv(arquivo, true);
      } else {
        data += await readCsv(arquivo, false);
      }

    }
    return data;
  } catch (erro) {
    console.error('Erro ao unir os files CSV:', erro);
    return [];
  }
};
const readCsv = async (pathFile, keepHeaders) => {
  let data = await readFile(pathFile, { encoding: 'utf-8' })
  let rows = data.split('\n')
  if (!keepHeaders) {
    rows.shift()
  }
  return rows.join('\n');
};
const joinCSVByService = async (service) => {
  const pathFolder = `temporaries/${service}`; 
  const files = listFolder(pathFolder).filter(csvName => csvName.includes(service)).map(csvName => `${pathFolder}\\${csvName}`)
  

  let finalCsv = await joinCSVs(files)
  await writeFile(`output/${service}.csv`, finalCsv)

  await rm(pathFolder, { recursive: true }, (err) => {
    if (err) {
      console.error('Erro ao deletar a pasta:', err);
      return;
    }
  });
  await mkdir(pathFolder);
}




export default joinCSVByService