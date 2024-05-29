import listFolder from './listFolder.mjs'
import { rm } from 'node:fs/promises'

const returnResumeObject = async (currentService) => {
  const files = listFolder(`temporaries/${currentService}`)

  let resumeObject = {
    state: 0,
    city: 0,
    registry: 0
  }
  if (files.length > 0) {
    const lastFileFullName = findLastFileCreated(files)

    await rm(`temporaries/${currentService}/${lastFileFullName}`, { recursive: true }, (err) => {
      if (err) {
        console.error('Erro ao deletar o arquivo:', err);
        return;
      }
    });

    let lastSearch = lastFileFullName.split('_')
    if (lastSearch.length > 2) {
      resumeObject.state = lastSearch[1]
      resumeObject.city = lastSearch[2]
      resumeObject.registry = lastSearch[3]
      resumeObject.createdBy = lastSearch[4]
    } else {
      resumeObject.stateIndex = lastSearch[1]
      resumeObject.createdBy = lastSearch[2]
    }

  } else {
    resumeObject.state = 0
    resumeObject.city = 0
    resumeObject.registry = 0
  }
  return resumeObject
}
const findLastFileCreated = (files) => {
  let lastCreated = '';
  let lastBiggerTimestamp = -1;

  files.forEach(fileName => {
    const regex = /createdBy=(\d+)\.csv/;
    const match = fileName.match(regex);
    if (match) {
      const timestamp = parseInt(match[1]);
      if (timestamp > lastBiggerTimestamp) {
        lastBiggerTimestamp = timestamp;
        lastCreated = fileName;
      }
    }
  });

  return lastCreated;
}
export default returnResumeObject