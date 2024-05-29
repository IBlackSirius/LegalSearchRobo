import { exec } from 'child_process'
import getBrowserFromSettings from './functions/getBrowserFromSettings.mjs'
import getPage from './functions/getPage.mjs'
import joinCsvByService from './functions/joinCsvByService.mjs'
import prepareToSearch from './functions/prepareToSearch.mjs'

(async () => {
  const browser = await getBrowserFromSettings()
  const defaultContext = browser.contexts()[0]



  const { page } = await getPage(defaultContext);

  let serviceOptions = await getListSelectOptions(`#ddlServicos`, page)
  page.close()

  let path =   "P:\\LegalSearchRobo"
  let arrServicesCall = serviceOptions
    .filter((option) => !option.text.includes('Selecione...'))
    .map((_, index) => (`"./src/cmdCommands/cmdStart.bat" "${path}" "${index}"`))
   
  arrServicesCall.forEach(call => {
    exec(call, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro ao abrir o terminal e executar o comando: ${error}`);
        return;
      }
      console.log('Comando executado com sucesso no novo terminal!');
    });
  })

  

  
})()
const getListSelectOptions = async (selector, page) => {

  await page.waitForSelector(selector, { timeout: 3000 });
  const options = await page.evaluate((selector) => {
    const selectElement = document.querySelector(selector);
    const optionElements = selectElement.querySelectorAll('option');
    const optionTexts = Array.from(optionElements).map(option => ({
      value: option.value,
      text: option.textContent.trim()
    }));
    return optionTexts;
  }, selector);
  return options;
};

