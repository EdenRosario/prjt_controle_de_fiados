import { DatabasePostgres } from "../database/pagamentos-repositoy.js";
import { ComprasRepository } from "../database/compras-repository.js";

const pagamentosRepository = new DatabasePostgres()
const comprasRepository = new ComprasRepository()

export async function registrarPagamentos(req, res) {

    try {

        if (!req.body) {
            return res.status(400).json({message : "body vazio"})
        }

        const { compraId, valorRecebido, metodoPagamento } = req.body

        if(!compraId || !valorRecebido || !metodoPagamento){
            return res.status(400).json({
                message : "Informe a compra, o valor recebido e o método de pagamento."
            })
        }

        if(!Number.isFinite(Number(valorRecebido)) || Number(valorRecebido) <=0){
            return res.status(400).json({
                message : "O valor recebido deve ser maior que zero."
            })
        }

        const pagamento = await pagamentosRepository.registrarPagamento({
            compraId,
            valorRecebido,
            metodoPagamento
        })
        //Atualiza o status após registrar o pagamento
        const compra = await comprasRepository.atualizarStatusCompra(compraId)

        if (!compra) {
            return res.status(404).json({ message: "não foi possivel atualizar status da compra" })
        }

        return res.status(201).json({
            message: "pagamento realizado com sucesso",
            pagamento,
            compra
        })

    } catch (error) {
        console.error(error)

        if(error.message?.incluedes("Pagamento inválido")){
            return res.status(400).json({
                message : error.message
            })
        }

        return res.status(500).json({
            error: "Erro interno no servidor"
        })
    }

}

export async function listarHistotricoPagamento(req, res) {

    try {

        const compraId = req.params.compraId

        if (!compraId) {
            return res.status(400).json({ message: "ID da compra não informado" })
        }

        const historicoPagamento = await pagamentosRepository.listarHistoricoPagamento(compraId)

        if (!historicoPagamento) {
            return res.status(404).json({ message: "nenhum pagamento encontrado" })
        }

        return res.status(200).json(historicoPagamento)

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: "Erro interno no servidor"
        })
    }

}


export async function resumoPagamentoCompra(req, res) {

    try {

        const compraId = req.params.compraId

        if (!compraId) {
            return res.status(400).jsonn({ message: "ID da compra não informado" })
        }

        const resumoPagamento = await pagamentosRepository.resumoPagamentoCompra(compraId)

        if (!resumoPagamento) {
            return res.status(404).json({ message: "nenhum pagamento encontrado" })
        }

        return res.status(200).json(resumoPagamento)

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: "Erro interno no servidor"
        })
    }

}

export async function calcularTotalPago(req, res) {

    try {

        const compraId = req.params.compraId

        if (!compraId) {
            return res.status(400).json({ message: "ID da compra não informado" })
        }

        const totalPago = await pagamentosRepository.calcularTotalPago(compraId)

        return res.status(200).json({totalPago})

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: "Erro interno no servidor"
        })
    }

}

export async function calcularSaldo(req, res) {

    try {

        const compraId = req.params.compraId

        if (!compraId) {
            return res.status(400).json({ message: "ID da compra não informado" })
        }

        const saldo = await pagamentosRepository.calcularSaldo(compraId)

        if (!saldo) {
            return res.status(404).json({ message: "não foi possivel obter o saldo devedor" })
        }

        return res.status(200).json(saldo)

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: "Erro interno no servidor"
        })
    }

}