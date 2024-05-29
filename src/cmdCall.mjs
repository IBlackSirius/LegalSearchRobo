import getBrowserFromSettings from './functions/getBrowserFromSettings.mjs'
import getListSelectOptions from './functions/getListSelectOptions.mjs'
import getPage from './functions/getPage.mjs'
import prepareToSearch from './functions/prepareToSearch.mjs'

(async () => {
  const browser = await getBrowserFromSettings()
  const defaultContext = await browser.newContext()



  const { page } = await getPage(defaultContext);
  let serviceOptions = await getListSelectOptions(`#ddlServicos`, page)
  const argumentos = process.argv.slice(2);

  let currentService = serviceOptions.filter((option) => !option.text.includes('Selecione...'))[argumentos[0]].text


  console.log('currentService :>> ', currentService);

  await prepareToSearch(page, currentService)
})()


