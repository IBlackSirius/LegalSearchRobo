import buildWorker from './functions/buildWorker.mjs'
import colors from 'colors';
import fs from 'fs'
import getBrowserFromSettings from './functions/getBrowserFromSettings.mjs'
import getListSelectOptions from './functions/getListSelectOptions.mjs'
import getPage from './functions/getPage.mjs'
import initCron from './commands/initCron.mjs'
import inquirer from 'inquirer';
import setBrowser from './commands/setBrowser.mjs';
import startEspecificServices from './commands/startEspecificServices.mjs'
import startNow from './commands/startNow.mjs'

const main = async (skip = false, thread = false) => {

  if (skip) {
    const browser = await getBrowserFromSettings()
    const defaultContext = browser.contexts()[0]
    const { page } = await getPage(defaultContext);
    let serviceOptions = await getListSelectOptions(`#ddlServicos`, page)
    page.close();

    let workers = {}
    let result = {
      services: serviceOptions
        .filter((option) => !option.text.includes('Selecione...'))
        .map((option) => ({ service: option.text }))
    }

    for (let index = 0; index < result.services.length; index++) {
      const { service } = result.services[index];
      workers[service] = await buildWorker(service, thread)
    }
  } else {
    let commands = [
      setBrowser(),
      initCron(),
      startNow(),
      startEspecificServices(),
      {
        command: 'Exit',
        exec() {
          process.exit();
        }
      }
    ];
    await inquirer.prompt([
      {
        type: 'list',
        name: 'Comando',
        message: 'Bem vindo, aparentemente você não possui o browser definido!'.blue,
        choices: commands.map(el => el.command)
      }
    ])
      .then(async ({ Comando }) => {
        await commands.find(el => el.command === Comando).exec({ main })
      })


  }

}


(async () => await main())();