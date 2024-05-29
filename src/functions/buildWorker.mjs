import { Worker } from 'worker_threads'

const buildWorker = async (name, promise = false) => {

  if (promise) {
    return new Promise((resolve, reject) => {
      const worker = new Worker('./src/functions/worker.mjs', {
        workerData: { name }
      })

      worker.on('message', async (message) => {
        if (message === 'Done') {
          await worker.terminate()
          resolve()
        } else {
          console.log(`${message}`);
        }
      })

      worker.on('exit', () => {
        console.log(`A busca do serviço ${name} finalizou com sucesso`);
      });

      worker.on('error', (error) => {
        console.log(`Erro no Worker ${name}, ${error}`);
      })

    })

  } else {
    const worker = new Worker('./src/functions/worker.mjs', {
      workerData: { name }
    })

    worker.on('message', async (message) => {
      if (message === 'Done') {
        await worker.terminate()
      } else {
        console.log(`${message}`);
      }
    })

    worker.on('exit', () => {
      console.log(`A busca do serviço ${name} finalizou com sucesso`);
    });

    worker.on('error', (error) => {
      console.log(`Erro no Worker ${name}, ${error}`);
    })
  }


}

export default buildWorker