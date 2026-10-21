
import { DatabasePostgres } from "../database/itens-compras-repository.js";
import { ComprasRepository } from "../database/compras-repository.js";

const itensComprasRepository = new DatabasePostgres();
const comprasRepository = new ComprasRepository();

export async function adicionarItem(req, res) {
    try {
        const { clienteId, produtoId, quantidade, precoUnitario } = req.body ?? {};


        if (
            clienteId == null || clienteId === "" ||
            produtoId == null || produtoId === "" ||
            quantidade == null || quantidade === "" ||
            precoUnitario == null || precoUnitario === ""
        ) {
            return res.status(400).json({
                message: "Informe todos os dados do produto."
            });
        }


        const quantidadeNumerica = Number(quantidade);
        const precoNumerico = Number(precoUnitario);

        if (
            !Number.isFinite(quantidadeNumerica) ||
            quantidadeNumerica <= 0
        ) {
            return res.status(400).json({
                message: "A quantidade deve ser um número maior que zero."
            });
        }

        if (
            !Number.isFinite(precoNumerico) ||
            precoNumerico < 0
        ) {
            return res.status(400).json({
                message: "O preço unitário informado é inválido."
            });
        }


        const compraCliente = await comprasRepository.buscarCompraEmAberto(clienteId);

        let compraId;

        if (!compraCliente) {

            const novaCompra = await comprasRepository.criarCompra(clienteId);

            if (!novaCompra?.id) {
                throw new Error("Não foi possível criar a compra.");
            }

            compraId = novaCompra.id;

        } else {

            compraId =
                typeof compraCliente === "object"
                    ? compraCliente.id
                    : compraCliente;
        };

        if (compraId == null || compraId === "") {
            throw new Error("Não foi possível identificar a compra.");
        };

        const compra = await itensComprasRepository.buscarStatuscompra(compraId);

        if (!compra) {
            return res.status(404).json({
                message: "Compra não encontrada."
            });
        };


        if (compra.status !== "aberto") {
            return res.status(409).json({
                message:
                    "Não é possível adicionar produtos a uma compra que não está aberta."
            });
        };


        const produto = await itensComprasRepository.adicionarItem({
            compraId,
            produtoId,
            quantidade: quantidadeNumerica,
            precoUnitario: precoNumerico
        });

        const compraAtualizada = await comprasRepository.atulizarTotal(compraId);

        if(compraAtualizada){
            res.status(201).json({
                message: "compra atualziada", compraAtualizada
            })
        }


        return res.status(201).json({
            message: "Produto adicionado com sucesso.",
            produto
        });

    } catch (error) {
        console.error("Erro ao adicionar item à compra:", error);

        return res.status(500).json({
            error: "Erro interno no servidor."
        });
    }
}

export async function listarItensDaCompra(req, res) {
    try {
        const { compraId } = req.params;

        if (!compraId) {
            return res.status(400).json({
                message: "Informe o ID da compra."
            });
        }

        const itensDaCompra =
            await itensComprasRepository.listarItensDaCompra(compraId);

        return res.status(200).json({
            message: "Itens da compra consultados com sucesso.",
            itens: itensDaCompra
        });

    } catch (error) {
        console.error("Erro ao listar itens da compra:", error);

        return res.status(500).json({
            error: "Erro interno no servidor."
        });
    }
}

export async function buscarDadosCompraEmAberto(req, res) {
    try {
        const { clienteId } = req.params;

        if (!clienteId) {
            return res.status(400).json({
                message: "Informe o ID do cliente."
            });
        }

        const dadosCompra =
            await itensComprasRepository.buscarDadosCompraEmAberto(clienteId);

        return res.status(200).json(dadosCompra);

    } catch (error) {
        console.error("Erro ao buscar compra em aberto:", error);

        return res.status(500).json({
            error: "Erro interno no servidor."
        });
    }
}
