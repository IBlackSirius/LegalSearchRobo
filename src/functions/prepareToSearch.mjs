import fs from 'fs';
import getListSelectOptions from './getListSelectOptions.mjs'
import joinCsvByService from './joinCsvByService.mjs'
import { mkdir } from 'node:fs/promises'
import returnResumeObject from './returnResumeObject.mjs'
import tableToCSV from './tableToCSV.mjs'

const locators = {
  service: 'ddlServicos',
  state: 'ddlEstado',
  statePP: 'ddlEstadoPP',
  city: 'ddlCidade',
  registry: 'ddlCartorio',
  search: 'btnConsultar',
  table: 'Grid',
  findState: false
}


const prepareToSearch = async (page, currentService) => {


  let serviceOptions = await getListSelectOptions(`#${locators.service}`, page)

  if (!fs.existsSync(`./temporaries/${currentService}`)) {
    await mkdir(`./temporaries/${currentService}`)
  }

  let resume = await returnResumeObject(currentService)


  let result = {
    services: serviceOptions
      .filter((option) => !option.text.includes('Selecione...'))
      .map((option) => ({ service: option.text }))
  }


  await search(page, currentService, result, resume)
}

const search = async (page, currentService, result, resumeObject) => {

  await page.selectOption(`#${locators.service}`, { label: currentService });
  let indexOfService = result.services.findIndex(({ service }) => service === currentService)
  if (!locators.findState) {
    setLocatorOfState(currentService)
  }



  result.services[indexOfService].states = await getStateOptions(page, locators.findState);

  let indexOfState = 0, indexOfCity = 0, indexOfRegistry = 0

  indexOfState = resumeObject.state !== 0 ? result.services[indexOfService].states.findIndex(({ state }) => state.text === resumeObject.state) : 0



  let attachCity = false
  let attachRegistry = false


  for (let y = indexOfState; y < result.services[indexOfService].states.length; y++) {

    //selecionando
    const state = result.services[indexOfService].states[y].state;
    await selectOptionByLabel(page, locators.findState, state);

    //pegando todas as cidades do estado atual
    result.services[indexOfService].states[y].cities = await getCityOptions(page, locators.city);


    indexOfCity = resumeObject.city !== 0 && !attachCity ? result.services[indexOfService].states[y].cities.findIndex(({ city }) => city.text === resumeObject.city) : 0
    attachCity = true


    if (result.services[indexOfService].states[y].cities.length > 0) {
      for (let u = indexOfCity; u < result.services[indexOfService].states[y].cities.length; u++) {

        const city = result.services[indexOfService].states[y].cities[u].city;

        await selectOptionByLabel(page, locators.city, city);


        result.services[indexOfService].states[y].cities[u].registries = await getRegistryOptions(page, locators.registry);
        indexOfRegistry = resumeObject.registry !== 0 && !attachRegistry ? result.services[indexOfService].states[y].cities[u].registries.findIndex(({ registry }) => registry.text === resumeObject.registry) : 0

        attachRegistry = true


        for (let searches = indexOfRegistry; searches < result.services[indexOfService].states[y].cities[u].registries.length; searches++) {
          const registry = result.services[indexOfService].states[y].cities[u].registries[searches].registry;

          await selectOptionByLabel(page, locators.registry, registry)

          await page.locator(`#${locators.search}`).click();


          let gridSelector = locators.table

          let tbodyContent = await page.evaluate(async ({ gridSelector, currentService }) => {

            let selectElement
            if (currentService === "E-Protocolo") {
              selectElement = document.getElementById('GridEprotocolo')

            } else if (currentService === "Visualização de Matrícula") {
              selectElement = document.querySelector('.table.table2.tableServicosOnline.table-striped')
            }
            else {
              selectElement = document.getElementById(gridSelector)
            }
            if (!selectElement) {
              selectElement = document.querySelector('.table.table2.tableServicosOnline.table-striped').outerHTML.replaceAll('\t', '').replaceAll('\n', '')
            } else {
              selectElement = selectElement.outerHTML.replaceAll('\t', '').replaceAll('\n', '')
            }

            return selectElement
          }, { gridSelector, currentService })
          let tableName = `${currentService}_${state.text}_${city.text}_${registry.text}_createdBy=${Date.now()}`

          let headersService = 'Serviço;Estado;Cidade;Cartório;'
          let searchParams = `${currentService};${state.text};${city.text};${registry.text};`

          await tableToCSV(tbodyContent, tableName, headersService, searchParams, currentService)
          await page.goBack()
        }
      }
    } else {
      await page.locator(`#${locators.search}`).click();

      let gridSelector = locators.table

      let tbodyContent = await page.evaluate(async ({ gridSelector, currentService }) => {
        let selectElement
        if (currentService === "Certidão Negativa CODHAB" || currentService === "Pesquisa Prévia") {
          selectElement = document.querySelector('.table.table2.tableServicosOnline.table-striped').outerHTML.replaceAll('\t', '').replaceAll('\n', '')
        } else {
          selectElement = document.getElementById(gridSelector).outerHTML.replaceAll('\t', '').replaceAll('\n', '')
        }

        return selectElement
      }, { gridSelector, currentService })

      let tableName = `${currentService}_${state.text}_createdBy=${Date.now()}`

      let headersService = 'Serviço;Estado;'
      let searchParams = `${currentService};${state.text};`

      await tableToCSV(tbodyContent, tableName, headersService, searchParams, currentService)
      await page.goBack()
    }
  }
  await joinCsvByService(currentService)

};

const getStateOptions = async (page, stateLocator) => {
  let stateOptions;

  try {
    stateOptions = await getListSelectOptions(`#${stateLocator}`, page);
  } catch (e) {
    console.log('A pagina esta lenta vou tentar selecionar o estado denovo');
    return stateOptions = await getStateOptions(page, stateLocator)
  }
  return stateOptions
    .filter((option) => !option.text.includes('Selecione...'))
    .map((option) => ({ state: option }));
};

const selectOptionByLabel = async (page, locator, label) => {
  try {
    await page.selectOption(`#${locator}`, { value: label.value }, { timeout: 15000 });
  } catch (error) {
    console.log(`A pagina esta lenta vou tentar selecionar ${label} denovo`);
    await selectOptionByLabel(page, locator, label)
  }
};

const getCityOptions = async (page, locator) => {
  let cityOptions;
  try {
    if (locators.findState === locators.statePP) {
      cityOptions = []
    }
    cityOptions = await getListSelectOptions(`#${locator}`, page);
  } catch (error) {
    cityOptions = []
  }
  return cityOptions
    .filter((option) => !option.text.includes('Selecione...'))
    .map((option) => ({ city: option }));
};

const getRegistryOptions = async (page, locator) => {
  let registryOptions;
  try {
    registryOptions = await getListSelectOptions(`#${locator}`, page);
  } catch (error) {
    registryOptions = [];
  }
  return registryOptions
    .filter((option) => !option.text.includes('Selecione...'))
    .map((option) => ({ registry: option }));
};

const setLocatorOfState = (currentService) => {
  if (currentService === "Pesquisa Prévia" || currentService === "Certidão Negativa CODHAB") {
    locators.findState = locators.statePP
  } else {
    locators.findState = locators.state
  }
}

export default prepareToSearch