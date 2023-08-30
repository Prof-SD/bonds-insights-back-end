import { Router } from 'express'
import apiController from '../controllers/api.controller.js'

const router = Router()

router
  .route('/:resource')
  .get(apiController.handleDataRequest)

export default router
