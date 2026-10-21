import { Router } from "express";

import * as produtosController from '../controllers/produtos.controller.js'

const router = Router()

router.post('/', produtosController.cadastrarProduto)

router.get('/listarprodutos', produtosController.listarProdutos)

router.get('/estoquebaixo', produtosController.listarEstoqueBaixo)

router.get('/buscarproduto/:produtoId', produtosController.buscarProdutoPorId)

router.get("/codigo-barras/:codigoBarras",produtosController.buscarProdutoPorCodigoBarras);

router.put('/atualizarestoque', produtosController.atualizarEstoque)

router.delete('/excluirproduto/:produtoId', produtosController.excluirProduto)

export default router