import express from 'express'
import config from './config/config.js'
import cors from 'cors'
import apiRouter from './routes/api.router.js'
import { initialDataJob, scheduleDataJob } from './jobs/dataJobs.js'

const app = express()
const PORT = config.app.PORT

await initialDataJob()
scheduleDataJob()
console.log(`Scheduled data job - Done at: ${new Date().toLocaleString()}`)

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', apiRouter)

app.use((req, res) => {
  res.status(404).json({
    message: 'Not Found'
  })
})
