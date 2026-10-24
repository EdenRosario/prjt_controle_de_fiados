 import { Router } from "express";
 import * as itensComprasController from '../controllers/itens-compras.controller.js'

 const router = Router()

 router.post('/', itensComprasController.adicionarItem)

 router.get('/buscarcupom/:clienteId', itensComprasController.buscarDadosCompraEmAberto)

 router.get('/itens/:compraId', itensComprasController.listarItensDaCompra)
 
 router.get('/compraDetalhada/:clienteId', itensComprasController.buscaCompraDetalhadaPorData)

 export default router