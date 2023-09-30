import express from 'express'

import { getToys, getToyById, addToy, removeToy, updateToy } from './toy.controller.js'
import { requireAdmin, requireAuth } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'

export const toyRoutes = express.Router()

// middleware that is specific to this router

toyRoutes.get('/', log, getToys)
toyRoutes.get('/:id', getToyById)
toyRoutes.post('/', requireAuth, requireAdmin, addToy)
toyRoutes.put('/', requireAuth, requireAdmin, updateToy)
toyRoutes.delete('/:id', requireAuth, requireAdmin, removeToy)

// carRoutes.post('/:id/msg', requireAuth, addCarMsg)
// carRoutes.delete('/:id/msg/:msgId', requireAuth, removeCarMsg)