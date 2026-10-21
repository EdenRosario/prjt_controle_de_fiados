import { Router } from "express";

import * as pagamentosContoller from '../controllers/pagamentos.controller.js'

const router = Router()

router.post('/', pagamentosContoller.registrarPagamentos)    

router.get('/historico/:compraId', pagamentosContoller.listarHistotricoPagamento)

router.get('/resumo/:compraId', pagamentosContoller.resumoPagamentoCompra)

router.get('/pago/:compraId', pagamentosContoller.calcularTotalPago)

router.get('/saldo/:compraId', pagamentosContoller.calcularSaldo)



export default router