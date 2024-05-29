import colors from 'colors'
import cron from 'node-cron'
import fs from 'fs'

const command = () => {
  return {
    command: 'Iniciar o Cron',
    async exec({ main }) {
      if (!fs.existsSync('./src/browser.json')) {
        console.log('Para iniciar o Cron é necessario antes definir o Browser'.yellow.bold);
        await main()
      }

      cron.schedule('0 23 * * *', async () => {
        await main(true)
      })
    }
  }

}
export default command