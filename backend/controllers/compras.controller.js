import { response } from "express";
import { ComprasRepository } from "../database/compras-repository.js";

const comprasRopository = new ComprasRepository()

export async function criarCompra(req, res) {

    try {

        const clienteId = req.params.clienteId

        if (!clienteId) {
            return res.status(400).json({ message: "ID do cliente não informado" })
        }

        console.log(`id cliente obtido ${clienteId}`)

        const compra = await comprasRopository.criarCompra(clienteId)

        console.table(compra)
        return res.status(201).json({ message: "compra criada com sucesso!" })

    } catch (error) {
        console.log(error)

        return res.status(500).json({ message: "Erro ao criar compra" })
    }


}

export async function buscarCompraEmAberto(req, res) {

    try {

        const clienteId = req.params.clienteId

        if (!clienteId) {
            return res.status(400).json({ message: "ID do cliente não informado" })
        }

        console.log(`id cliente obtido ${clienteId}`)

        const busca = await comprasRopository.buscarCompraEmAberto(clienteId)

        if (!busca) {
            return res.status(404).json({ message: "Compra não encontrada" })
        }

        console.table(busca)
        return res.status(201).json(busca)

    } catch (error) {
        console.log(error)

        return res.status(500).json({ message: "erro ao buscar compra" })
    }

}

export async function atulizarTotal(req, res) {
    try {
        const compraId = req.params.compraId;

        if (!compraId) {
            return res.status(400).json({
                message: "ID da compra não informado."
            });
        }

        const compra = await comprasRopository.atulizarTotal(compraId);

        if (!compra) {
            return res.status(404).json({
                message: "Compra não encontrada."
            });
        }

        return res.status(200).json({
            message: "Total da compra atualizado com sucesso.",
            compra
        });

    } catch (error) {
        console.error("Erro ao atualizar total da compra:", error);

        return res.status(500).json({
            message: "Erro interno ao atualizar o total da compra."
        });
    }
}
