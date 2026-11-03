import { response } from "express";
import { DatabasePostgres } from "../database/clients-repository.js";
import { ComprasRepository } from "../database/compras-repository.js";
import { PagamentosRepository } from "../database/pagamentos-repositoy.js"


const pagamentosRepository = new PagamentosRepository()
const comprasRepository = new ComprasRepository();
const clientRepository = new DatabasePostgres();

export async function createCliet(req, res) {
    try {

        if (!req.body) {
            res.status(400).send("body vazio")
        }

        const { name, tel, email, cpf } = req.body

        await clientRepository.create({

            name,
            tel,
            email,
            cpf

        })

        return res.status(201).json({ message: "cliente criado com sucesso" })

    } catch (error) {

        console.error(error)
        return res.status(500).json({
            error: "Erro interno no servidor"
        })

    }
}

export async function searchClient(req, res) {

    try {

        if (!req.query.search) {
            return res.status(400).send("vazio")
        }

        const search = req.query.search

        const clientSearch = await clientRepository.list(search)

        if (clientSearch.length == 0) {
            return res.status(404).send("cliente não encontrado")
        }

        return res.status(200).json(clientSearch)

    } catch (error) {

        console.error(error)
        return res.status(500).json({
            error: "Erro interno no servidor"
        })

    }

}

export async function listarTodosClientes(req, res) {

    try {

        const clientes = await clientRepository.listarTodosClientes()

        if (!clientes) {
            return res.status(404).json({
                message: "Não foi possivel obter os clientes"
            })
        }

        return res.status(200).json(clientes)

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: "Erro interno no servidor"
        })

    }

}

export async function listarTodosClientesTodasComprasTodosPagamentos(req, res) {

    try {

        const totalClientes = await clientRepository.listAllClientes()
        const totalValorCompras = await comprasRepository.somarComprasEmAberto()
        const totalPago = await pagamentosRepository.calcularTotalPagoComprasEmAberto()

        if (!totalClientes) {
            return res.status(404).json({
                message: "não foi possivel lisatar o numero de clientes cadastrados"
            })
        }

        if (!totalValorCompras) {
            return res.status(404).json({
                message: "não foi possivel obter valor total das compras"
            })
        };

        if (totalPago == undefined) {
            return res.status(404).json({
                message: "não foi possivel obter valor total pago das compras em aberto"
            })
        };

        return res.status(200).json({
            totalClientes,
            totalValorCompras,
            totalPago
        });

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: "Erro interno no servidor"
        })
    }
}


export async function atualizarDados(req, res) {

    try {

        if (!req.params.clientId) {
            return res.status(404).json({
                message: "nenhum id enviado"
            })
        }

        const clienteId = req.params.clientId

        if (!req.body) {
            return res.status(404).json({
                message: "body vazio"
            })
        }

        const { nome, cpf, tel, email } = req.body

        if (!nome) {
            return res.status(404).json({
                message: "nenhum nome enviado"
            })
        }

        if (!cpf) {
            return res.status(404).json({
                message: "nenhum cpf enviado"
            })
        }

        if (!tel) {
            return res.status(404).json({
                message: "nenhum telefone enviado"
            })
        }

        if (!email) {
            return res.status(404).json({
                message: "nenhum email enviado"
            })
        }

        const resp = await clientRepository.atualizarDados({
            clienteId,
            nome,
            cpf,
            tel,
            email
        })

        if (!resp) {
            return res.status(404).json({
                message: "não foi possivel atualizar os dados solicitados"
            })
        }

        return res.status(200).json({
            message: "Dados atualizados com sucesso!",
            resp
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: "erro ao atualizar dados do cliente"
        })
    }

}

export async function mudarStatusConta(req, res) {

    try {

        const clienteId = req.params.clientId;
        let acao = req.body.novoStatus;

        console.log("ID recebido:", req.params.clientId);
        console.log("Body recebido:", req.body);
        console.log("Ação recebida:", req.body.novoStatus);

        if (!clienteId) {
            return res.status(404).json({
                "message": "Id do cliente não recebido"
            });
        }

        if (!acao) {
            return res.status.json({
                "message": "novo status não recebido"
            });
        }
        let novoStatus;

        if (acao === "desativar") {
            novoStatus = false;
        } else if (acao === "reativar") {
            novoStatus = true;
        } else {
            return res.status(400).json({
                message: "Ação inválida"
            });
        }

        const statusClienteAtualizado = await clientRepository.mudarStatusConta(clienteId, novoStatus);

        if (!statusClienteAtualizado) {
            return res.status(400).json({
                "message": "Não foi possivel atualizar status do cliente"
            })
        }

        return res.status(200).json({
            "message": "status do cliente atualizado com sucesso!",
            statusClienteAtualizado
        });

    } catch (error) {
        console.error("Erro no controller mudarStatusConta:",error)
        
        return res.status(500).json({
            error: "Erro interno no servidor"
        })
    }


}