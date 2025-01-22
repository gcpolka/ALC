const pipeRouter = require('express').Router()
const pipeController = require('../controllers/pipeController')

pipeRouter.get('/', pipeController.listPipe)
pipeRouter.get('/:id', pipeController.getPipeById)

pipeRouter.post('/', pipeController.createPipe)

pipeRouter.put('/:id', pipeController.updatePipe)

pipeRouter.delete('/:id', pipeController.deletePipe)

module.exports = pipeRouter