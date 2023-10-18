import cron from 'node-cron'
import { processData } from '../services/processData.service.js'
import fs from 'fs'
import path from 'path'
import { MINUTES } from '../constants.js'

const scheduleDataJob = () => {
  const directory = './src/data'

  cron.schedule(`*/${MINUTES} * * * *`, async () => {
    try {
      console.log(`Running data pre-processing job every ${MINUTES} minutes`)


      const processedData = await processData()

      for (let i = 0; i < processedData.length; i++) {
        if (fs.existsSync(path.join(directory, `data${i + 1}.json`))) {
          fs.unlink(path.join(directory, `data${i + 1}.json`), (err) => {
            if (err) throw err
          })
        }

        fs.writeFile(path.join(directory, `data${i + 1}.json`), JSON.stringify(processedData[i]), (err) => {
          if (err) throw err
        })
      }

      console.log(`Data pre-processing job completed - Done at: ${new Date().toLocaleString()}}`)
    } catch (error) {
      console.log(error)
    }
  })
}

const initialDataJob = async () => {
  const directory = './src/data'

  try {
    console.log('Running initial data pre-processing job')

    const processedData = await processData()

    for (let i = 0; i < processedData?.length; i++) {
      if (fs.existsSync(path.join(directory, `data${i + 1}.json`))) {
        fs.unlink(path.join(directory, `data${i + 1}.json`), (err) => {
          console.log('THERE WAS AN ERROR IN UNLINK')
          console.log(err.message)
          console.log('--------')
          if (err) throw err
        })
      }

      fs.writeFile(path.join(directory, `data${i + 1}.json`), JSON.stringify(processedData[i]), (err) => {
        if (err) throw err
      })
    }

    console.log(`Initial data pre-processing job completed - Done at: ${new Date().toLocaleString()}}`)
  } catch (error) {
    console.log(error)
  }
}

export {
  scheduleDataJob,
  initialDataJob
}
