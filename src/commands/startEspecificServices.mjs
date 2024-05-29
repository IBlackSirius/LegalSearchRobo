import buildWorker from '../functions/buildWorker.mjs'
import fs from 'fs';
import getBrowserFromSettings from '../functions/getBrowserFromSettings.mjs'
import getListSelectOptions from '../functions/getListSelectOptions.mjs'
import getPage from '../functions/getPage.mjs'
import inquirer from 'inquirer';

const command = () => {
  return {
    command: 'Iniciar busca de serviços específico',
    async exec({ main }) {
      if (!fs.existsSync('./src/browser.json')) {
        console.log('Para iniciar  é necessario antes definir o Browser'.yellow.bold);
        await main()
      } else {

        const browser = await getBrowserFromSettings()
        const defaultContext = browser.contexts()[0]
        const { page } = await getPage(defaultContext);
        let serviceOptions = await getListSelectOptions(`#ddlServicos`, page)
        page.close();
        let workers = {}

        let { services } = await inquirer.prompt([
          {
            type: 'checkbox',
            name: 'services',
            message: 'Escolha os Serviços para iniciar a busca',
            choices: serviceOptions
              .filter((option) => !option.text.includes('Selecione...'))
              .map((option) => ({ name: option.text, value: option.text }))
          }
        ])

        for (let index = 0; index < services.length; index++) {
          const service = services[index]
          workers[service] = buildWorker(service)
        }
      }
    },
    default: true
  }
}

export default command
