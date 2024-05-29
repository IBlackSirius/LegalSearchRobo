import { parentPort, workerData } from 'worker_threads';

import getBrowserFromSettings from './getBrowserFromSettings.mjs'
import getPage from './getPage.mjs'
import prepareToSearch from './prepareToSearch.mjs'

const workerJob = async () => {
  let { name } = workerData
  const browser = await getBrowserFromSettings()
  const defaultContext = browser.contexts()[0]

  const { page } = await getPage(defaultContext);

  try {
    parentPort.postMessage(`Iniciando a Busca do Serviço ${name}`);
    await prepareToSearch(page, name)    
    page.close()    
    parentPort.postMessage('Done')
  } catch (error) {
    console.log(`Error no Worker ${name} :>> `, error);
    console.log(`Reiniciando a Busca do Serviço ${name}`);
    page.close()
    await workerJob()
  }
}


(async () => await workerJob())()