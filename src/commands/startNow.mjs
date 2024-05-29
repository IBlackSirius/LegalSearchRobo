import colors from 'colors'
import fs from 'fs'
import inquirer from 'inquirer'

const command = () => {
  return {
    command: 'Iniciar agora',
    async exec({ main }) {
      if (!fs.existsSync('./src/browser.json')) {
        console.log('Para iniciar  é necessario antes definir o Browser'.yellow.bold);
        await main()
      }else{
        await inquirer.prompt([
          {
            type: 'confirm',
            name: 'thread',
            message: 'Voce gostaria de executar a pesquisa um por um  ?'.blue,            
          }
        ])
          .then(async ({ thread }) => {
            
            await main(true,thread)
          })
      }


    }
  }

}
export default command