import express from 'express'
import config from './config/config.js'
import cors from 'cors'
import apiRouter from './routes/api.router.js'
import { initialDataJob, scheduleDataJob } from './jobs/dataJobs.js'

const app = express()
const PORT = config.app.PORT || 3000
const HOST = '0.0.0.0'

await initialDataJob()
scheduleDataJob()
console.log(`Scheduled data job - Done at: ${new Date().toLocaleString()}`)

app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`)
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
