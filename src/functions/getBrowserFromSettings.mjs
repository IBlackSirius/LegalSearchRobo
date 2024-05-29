import { chromium } from 'playwright-core';
import { exec } from 'child_process';
import fs from 'fs';

const getBrowserFromSettings = async () => {
  let browser = await chromium.connectOverCDP('http://127.0.0.1:9222/').catch(async (err) => {
    if (fs.existsSync('./src/browser.json')) {
      let { pathBrowser, browserExe } = JSON.parse(await fs.promises.readFile('./src/browser.json'))

      // ? Caso vc leve o robô para outro computador, portanto o arquivo browser.json irá existir porem relativo ao outro computador

      if (fs.existsSync(pathBrowser)) {
        exec(`"./src/cmdCommands/killChrome.bat" "${pathBrowser}" "${browserExe}"`);
        await new Promise((resolve) => setTimeout(resolve, 3000))
        return await getBrowserFromSettings()
      }
    }
  })

  return browser
}
export default getBrowserFromSettings