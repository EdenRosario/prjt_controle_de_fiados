import { Router } from "express";
import * as comprasController from '../controllers/compras.controller.js'

const router = Router()

router.post('/:clienteId', comprasController.criarCompra)
router.get('/aberta/:clienteId', comprasController.buscarCompraEmAberto)
router.put('/atualizar/:compraId', comprasController.atulizarTotal)

export default router