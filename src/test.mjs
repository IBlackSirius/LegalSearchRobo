import { access, mkdir, readFile, rm, writeFile } from 'node:fs/promises'

import fs from 'fs'
import listFolder from './functions/listFolder.mjs'

(async () => {
  let name = "Visualização de Matrícula_Tocantins_LIZARDA_01º RI - LIZARDA - TO_createdBy=1716488123581.csv"
  let currentService = "Visualização de Matrícula"
  const pathFolder = `temporaries/${currentService}`;
  const file = listFolder(pathFolder).find(csvName => csvName.includes(name.split("_createdBy=")[0]))
  if (fs.existsSync(`${pathFolder}/${file}`)) {
    console.log('me deleta cara to repetido irmão');
  }

})()



