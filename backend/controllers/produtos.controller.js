import { DatabasePostgres } from "../database/products-repository.js";

const produtosRepository = new DatabasePostgres()

export async function cadastrarProduto(req, res) {

    try {
        if (!req.body) {
            return res.status(400).send("body vazio")
        }

        const { codigoBarras, nome, preco, setor } = req.body

        if (
            !codigoBarras || !nome || preco === undefined || preco === null) {
            return res.status(400).json({
                message: "Informe todos os dados obrigatórios do produto."
            });
        }


        if (typeof codigoBarras !== "string" || !codigoBarras.trim()) {
            return res.status(400).json({
                message: "Informe um código de barras válido."
            });
        }


        if (typeof nome !== "string" || !nome.trim()) {
            return res.status(400).json({
                message: "Informe um nome válido para o produto."
            });
        }


        if (
            !Number.isFinite(Number(preco)) ||
            Number(preco) < 0
        ) {
            return res.status(400).json({
                message: "O preço deve ser um número válido e não negativo."
            });
        }

        if (typeof setor !== "string" || !setor.trim()) {
            return res.status(400).json({
                message: "Informe o setor do produto."
            });
        }

        const resp = await produtosRepository.cadastrarProduto({
            codigoBarras,
            nome,
            preco,
            setor
        })

        return res.status(201).json({ message: "produto cadastrado com sucesso!", resp })

    } catch (error) {
        console.error("Erro ao cadastrar produto:", error);
        console.log("Mensagem:", error.message);

        if (error.message?.includes("Já existe um produto cadastrado")) {
            return res.status(409).json({
                message: error.message
            });
        }

        return res.status(500).json({
            error: "Erro interno no servidor",
            detalhe: error.message
        });
    }

}



export async function listarProdutos(req, res) {

    try {

        const produtos = await produtosRepository.listarProdutos()

        if (produtos.length === 0) {
            return res.status(404).send("nenhum produto encontrado")
        }

        return res.status(200).json(produtos)

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: "Erro interno no servidor"
        })
    }
}

export async function listarEstoqueBaixo(req, res) {

    try {

        const produtos = await produtosRepository.listarEstoqueBaixo()

        if (produtos.length === 0) {
            return res.status(404).send("nenhum produto encontrado")
        }

        return res.status(200).json(produtos)

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: "Erro interno no servidor"
        })
    }
}

export async function buscarProdutoPorId(req, res) {

    try {

        const produtoId = req.params.produtoId

        if (!produtoId) {
            return res.status(400).json("identificação invalida")
        }

        const produto = await produtosRepository.buscarProdutoPorId(produtoId)

        if (!produto) {
            return res.status(404).send("nenhum produto encontrado")
        }

        return res.status(200).json(produto)

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: "Erro interno no servidor"
        })
    }

}


export async function buscarProdutoPorCodigoBarras(req, res) {
    try {
        const codigoBarras = req.params.codigoBarras;

        if (!codigoBarras) {
            return res.status(400).json({
                message: "Código de barras inválido"
            });
        }

        const produto = await produtosRepository.buscarProdutoPorCodigoBarras(
            codigoBarras
        );

        if (!produto) {
            return res.status(404).json({
                message: "Nenhum produto encontrado"
            });
        }

        return res.status(200).json(produto);

    } catch (error) {
        console.error("Erro ao buscar produto por código de barras:", error);

        return res.status(500).json({
            message: "Erro interno no servidor"
        });
    }
}



export async function verificarEstoque(req, res) {

    try {

        if (!req.body) {
            return res.status(400).send("body vazio")
        }

        const { produtoId, quantidadeSolicitada } = req.body

        const produto = await produtosRepository.verificarEstoque(
            produtoId,
            quantidadeSolicitada
        )

        if (produto.length === 0) {
            return res.status(404).send("Estoque insuficiente para a quantidade solicitada")
        }
        return res.status(200).json(produto)

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: "Erro interno no servidor"
        })
    }
}

export async function atualizarEstoque(req, res) {

    try {

        if (!req.body) {
            return res.status(400).send("body vazio")
        }

        const { produtoId, quantidade } = req.body

        const produto = await produtosRepository.atualizarEstoque({
            produtoId,
            quantidade
        })

        if (!produto) {
            return res.status(404).json({ message: "estoque insuficiente ou produto não encontrado" })
        }

        return res.status(201).json(produto)

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: "Erro interno no servidor"
        })
    }

}

export async function excluirProduto(req, res) {

    try {

        const produtoId = req.params.produtoId

        if (!produtoId) {
            return res.status(400).json("identificação invalida")
        }

        const produtoExcluido = await produtosRepository.excluirProduto(produtoId)

        if (!produtoExcluido) {
            return res.status(404).json({
                message: "não foi possviel excluir o produto, pois, não foi localizado em nossa base de dados"
            })
        }

        return res.status(200).json({
            message: "produto deletado com sucesso!",
            produto: produtoExcluido
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: "Erro interno no servidor"
        })
    }
}