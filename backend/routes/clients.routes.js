import { Router } from "express";
import * as clientController from '../controllers/clients.controller.js'

const router = Router()

router.post('/',clientController.createCliet)
router.get('/', clientController.searchClient)
router.get('/todos', clientController.listarTodosClientes)
router.get('/total', clientController.listarTodosClientesTodasComprasTodosPagamentos)
router.put('/:clientId', clientController.atualizarDados)
router.put('/status/:clientId', clientController.mudarStatusConta)
router.delete('/:id', clientController.deletClient)

export default router