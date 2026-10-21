import { response } from "express";
import { DatabasePostgres } from "../database/itens-compras-repository.js"

const ItensComprasRepository = new DatabasePostgres()


export async function adicionarItem(req, res) {

    try {

        if (!req.body) {
            return res.status(400).json({ mensage: "body vazio" })
        }

        const { compraId, produtoId, quantidade, precoUnitario } = req.body

        if (!compraId || !produtoId || !quantidade || !precoUnitario) {
            return res.status(400).json({
                message: "Informe todos os dados do produto."
            })
        }

        const compra = await ItensComprasRepository.buscarStatuscompra(compraId)

        if (!compra) {
            return res.status(404).json({
                message: "Compra não encontrada."
            })
        }

        if (compra.status !== "aberto") {
            return res.status(409).json({
                message: "Não é possível adicionar produtos a uma compra que não está aberta."
            })
        }


        await ItensComprasRepository.adicionarItem({
            compraId,
            produtoId,
            quantidade,
            precoUnitario
        })

        return res.status(201).json({ message: "produto adicionado com sucesso" })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: "Erro interno no servidor"
        })
    }

}

export async function listarItensDaCompra(req, res) {
    try {

        const compraId = req.params.compraId

        if (!compraId) {
            return res.status(400).json({ message: "Erro ao buscar itens da compra " })
        }

        const itensDaCompra = await ItensComprasRepository.listarItensDaCompra(compraId)
        console.table(itensDaCompra)
        return res.status(200).json(itensDaCompra)

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: "Erro interno no servidor"
        })
    }
}

export async function buscarDadosCompraEmAberto(req, res) {

    try {

        const clienteId = req.params.clienteId

        if (!clienteId) {
            return res.status(400).json({ message: "Erro ao buscar compra" })
        }

        const dadosCompra = await ItensComprasRepository.buscarDadosCompraEmAberto(clienteId)
        console.table(dadosCompra)
        return res.status(200).json(dadosCompra)

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: "Erro interno no servidor"
        })
    }

}