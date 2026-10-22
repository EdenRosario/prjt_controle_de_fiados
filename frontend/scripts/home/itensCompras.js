import {
    preencherCamposModalProduto,
    abrirModalAdicionarItem,
} from "./produtos.js";

export async function obterProdutoBackEnd(codigoBarras) {
    if (codigoBarras) {
        try {
            const response = await fetch(
                `http://localhost:3000/produtos/codigo-barras/${codigoBarras}`,
            );

            const data = await response.json();

            if (
                response.status === 404 &&
                data.message === "Nenhum produto encontrado"
            ) {
                throw new Error("PRODUTO_NAO_CADASTRADO");
            }

            if (!response.ok) {
                console.error(produto);
                console.log("Não foi possivel buscar produto");
                throw new Error(
                    data.message || data.error || "Não foi possível buscar o produto.",
                );
            }

            const produto = data.produto ?? data;

            if (
                data.error === "Nenhum codigo de barras informado" ||
                data.message === "Nenhum codigo de barras informado"
            ) {
                throw new Error("Informe o código de barras do produto.");
            }

            if (
                data.erro === "Nenhum produto encontrado" ||
                data.message === "Nenhum produto encontrado"
            ) {
                throw new Error("Produto não cadastrado.");
            }

            if (!produto || !produto.id) {
                throw new Error("Produto não cadastrado.");
            }

            console.log("Produto encontrado:", produto);

            return produto;
        } catch (error) {
            console.error("Erro ao buscar produto:", error);
            throw error;
        }
    } else {
        window.alert(
            "[ERRO] Não foi possivel adicionar o produto, por favor preencha o campo de codigo de barras",
        );
    }
}

export async function adicionarItempCompra(
    clienteId,
    produtoId,
    quantidade,
    precoUnitario,
) {
    console.log("produto backend ", {
        clienteId: clienteId,
        produtoId: produtoId,
        quantidade: quantidade,
        precoUnitario: precoUnitario,
    });

    if (!clienteId) {
        throw new Error("nenhum cliente encontrado");
    } else if (!produtoId) {
        throw new Error("nenhum produto encontrado");
    } else {
        try {
            const response = await fetch("http://localhost:3000/itensCompras", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    clienteId: clienteId,
                    produtoId: produtoId,
                    quantidade: quantidade,
                    precoUnitario: precoUnitario,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.error ||
                    "Não foi possível adicionar o produto à compra.",
                );
            }

            if (data.message === "body vazio") {
                console.log("body vazio");
                return false;
            }

            if (data.message === "Informe todos os dados do produto.") {
                console.log("Informe todos os dados do produto.");
                return false;
            }

            if (data.message === "Compra não encontrada.") {
                console.log("Compra não encontrada.");
                return false;
            }

            if (
                data.message ===
                "Não é possível adicionar produtos a uma compra que não está aberta."
            ) {
                console.log(
                    "Não é possível adicionar produtos a uma compra que não está aberta.",
                );
                return false;
            }

            console.log("produto adicionado com sucesso", data);
            return data;
        } catch (error) {
            console.error("Erro ao adicionar item à compra:", error);
            throw error;
        }
    }
}

export async function cadastrarProduto(codigoBarras, nome, preco, setor) {
    if (!codigoBarras || !nome || !preco || !setor) {
        throw new Error("Erro ao cadastrar produto");
    } else {
        try {
            const response = await fetch("http://localhost:3000/produtos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    codigoBarras,
                    nome,
                    preco,
                    setor,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.error ||
                    "Não foi possível adicionar o produto à compra.",
                );
            }

            console.log("produto cadastrado com sucesso!", data);
            return data;
        } catch (error) {

            if (error instanceof TypeError) {
                throw new Error(
                    "Não foi possível conectar à API. Verifique se o servidor está funcionando."
                );
            }

            throw error;

        }
    }
}
// export async function atualizarTotalCompra(compraId) {

//     if (!compraId) {
//         throw new Error("nenhuma compra encontrada");
//     } else {

//         try {

//             const response = await fetch(`http://localhost:3000/compras/atualizar/${compraId}`,{
//                   method: "PUT"
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(
//                     data.message ||
//                     data.error ||
//                     "Não foi possível atualizar totol da compra."
//                 );
//             };

//             if (data.message === "ID da compra não informado.") {
//                 console.log("ID da compra não informado.");
//                 return false;
//             };

//             if (data.message === "Compra não encontrada.") {
//                 console.log("Compra não encontrada.");
//                 return false;
//             };

//             console.log("total da compra atualizado com sucesso!")
//             return data;

//         } catch (error) {
//             console.error("Erro ao atualizar total da compra:", error);
//             throw error;
//         };
//     };

// };

// export async function buscarCompraEmAberto(clienteId) {

//     if (!clienteId) {
//         throw new Error("Nenhuma compra em aberto encontrada");
//     } else {

//         try {

//             const response = await fetch(`http://localhost:3000/compras/aberta/${clienteId}`)

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(
//                     data.message ||
//                     data.error ||
//                     "Não foi possível obter compra compra em aberto."
//                 );
//             };

//             if (data.message === "ID do cliente não informado" ) {
//                 console.log("ID do cliente não informado" );
//                 return false;
//             };

//             if (data.message === "Compra não encontrada") {
//                 console.log("Compra não encontrada");
//                 return false;
//             };

//             console.log("busca da compra realiizada sucesso!")
//             return data;

//         } catch (error) {
//             console.error("Erro ao tentar buscar compra em aberto", error);
//             throw error;
//         };

//     };

// }
