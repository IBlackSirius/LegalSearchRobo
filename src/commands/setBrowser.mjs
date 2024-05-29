import colors from 'colors';
import inquirer from 'inquirer';
import fs from 'fs';
import { exec } from 'child_process';

const command = () => {
    return {
        command: 'Definir Navegador',
        async exec({ main }) {
            console.log('Informo que o Browser a ser definido deverá ser a Base do Chromium (Google Chrome, Microsoft Edge, Opera, Brave, Vivaldi, Chromium)'.yellow.bold);
            exec('explorer')
            inquirer.prompt([
                {
                    type: 'input',
                    message: "Por favor informe a pasta de instalação do Browser que deseja utilizar".blue.bold,
                    name: "pathBrowser"
                },
                {
                    type: 'input',
                    message: "Por favor informe o nome do arquivo executavel que abrirá o browser (ex: chrome.exe)".blue.bold,
                    name: "browserExe"
                }
            ]).then(async ({ pathBrowser, browserExe }) => {
                await fs.promises.writeFile('./src/browser.json', JSON.stringify({
                    pathBrowser,
                    browserExe
                }, null, 2), 'utf-8')
                await main()
            })
        },
        default: true
    }
}

export default command