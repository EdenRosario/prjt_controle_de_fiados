import { adicionarItempCompra } from "./itensCompras.js";
import { obterProdutoBackEnd } from "./itensCompras.js";
import { cadastrarProduto } from "./itensCompras.js"

let clienteAtual = null;
let eventoInicializado = false;
let produtoAtual = null;
const modalAdicionarItem = document.querySelector("#modal-adicionar-item");
const modalCadastrarProduto = document.querySelector("#modal-cadastrar-produto");

const normalizarPreco = (valor) => {
    const valorInformado = valor.trim();

    if (!valorInformado) {
        return null;
    }

    const valorNormalizado = valorInformado.includes(",")
        ? valorInformado.replaceAll(".", "").replace(",", ".")
        : valorInformado;

    const preco = Number(valorNormalizado);

    return Number.isFinite(preco) && preco >= 0 ? preco : null;
};

const abrirModalCadastrarProduto = (codigoBarras) => {

    if (!modalCadastrarProduto) {
        return;
    };

    const form = modalCadastrarProduto.querySelector("#form-cadastrar-produto");

    form.reset();
    form.querySelector("#codigoBarras").value = codigoBarras;
    form.querySelector("#preco").value = "0,00";

    modalAdicionarItem.classList.remove("show");
    modalCadastrarProduto.classList.add("show");
    form.querySelector("#codigoBarras").focus();

};

const inicializarCadastroProduto = async () => {
    if (!modalCadastrarProduto) {
        return;
    };

    const form = modalCadastrarProduto.querySelector("#form-cadastrar-produto");

    const inputPreco = form.querySelector("#preco");


    inputPreco.addEventListener("input", () => {
        inputPreco.setCustomValidity("");
    });

    form.addEventListener("submit", async (evt) => {

        event.preventDefault();

        let codigoBarras = form.querySelector("#codigoBarras").value;
        let nome = form.querySelector("#nome").value;
        let setor = form.querySelector("#setor").value;
        let preco = normalizarPreco(inputPreco.value);

        if (!nome) {
            window.showToast("Informe o nome do produto.", "error");
            return;
        }

        if (!setor) {
            window.showToast("Selecione o setor do produto.", "error");
            return;
        }

        if (
            preco === null ||
            preco === undefined ||
            preco === "" ||
            !Number.isFinite(Number(preco)) ||
            Number(preco) <= 0
        ) {
            inputPreco.setCustomValidity(
                "Informe um preço válido e não negativo."
            );

            inputPreco.reportValidity();

            window.showToast(
                "O preço deve ser um número válido e não negativo.",
                "error"
            );

            return;
        };

        try {

            const produtoCadastrado = await cadastrarProduto(
                codigoBarras,
                nome,
                preco,
                setor
            );

            if (produtoCadastrado) {
                window.showToast(
                    "Produto cadastrado com sucesso.",
                    "success"
                );

                console.log(
                    "Produto cadastrado com sucesso!",
                    produtoCadastrado
                )

                form.reset();
                inputPreco.setCustomValidity("");
                
            };

        } catch (error) {

            console.error("Erro ao cadastrar produto:", error);

            window.showToast(
                error.message || "Não foi possível cadastrar o produto.",
                "error"
            );

        };

    });
};

const formatarMoeda = (valor) => {

    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(valor);

};

const atualizarTotal = (preco) => {

    const form = modalAdicionarItem.querySelector("#form-adicionar-item")
    const quantidade = form.querySelector("#item-quantidade").value;
    const total = Number(preco) * Number(quantidade);

    form.querySelector("#item-total").innerHTML = formatarMoeda(total);

};

const preencherCamposModalProduto = (nome, preco) => {

    const form = modalAdicionarItem.querySelector("#form-adicionar-item");
    form.querySelector("#item-nome").value = nome;
    form.querySelector("#item-valor").value = preco;

    atualizarTotal(preco);
};

const buscarProdutoPeloCodigo = async () => {

    const form = modalAdicionarItem.querySelector("#form-adicionar-item")
    const codigoBarras = form.querySelector("#codigo-de-barras").value.trim();

    if (!codigoBarras) {
        return;
    }
    try {
        produtoAtual = null;

        const produto = await obterProdutoBackEnd(codigoBarras);

        produtoAtual = produto;

        preencherCamposModalProduto(
            produtoAtual.nome,
            produtoAtual.preco
        );

    } catch (error) {

        produtoAtual = null;

        form.querySelector("#item-nome").value = "";
        form.querySelector("#item-valor").value = "";
        form.querySelector("#item-total").textContent = "";

        if (error.message === "PRODUTO_NAO_CADASTRADO") {
            const desejaCadastrar = window.confirm(
                "O produto não foi encontrado na base de dados. Deseja cadastrar esse produto?"
            );

            if (desejaCadastrar) {
                abrirModalCadastrarProduto(codigoBarras);
            }

            return;
        }



        window.showToast(
            error.message || "Produto não encontrado.",
            "error"
        );

    }

}

const iniciaBuscaProduto = async () => {

    const inputCodigoBarras = modalAdicionarItem.querySelector(
        "#codigo-de-barras"
    );

    inputCodigoBarras.addEventListener("keydown", async (evt) => {
        if (evt.key !== "Enter") {
            return;
        }

        evt.preventDefault();
        evt.stopPropagation();
        evt.stopImmediatePropagation();

        await buscarProdutoPeloCodigo();
    });
};

const inicializarProdutos = () => {
    if (eventoInicializado) {
        return;
    };

    iniciaBuscaProduto();
    inicializarCadastroProduto();

    const form = modalAdicionarItem.querySelector("#form-adicionar-item");
    const inputQuantidade = form.querySelector("#item-quantidade");



    inputQuantidade.addEventListener("input", () => {
        if (produtoAtual) {
            atualizarTotal(produtoAtual.preco);
        };
    });

    const btnAddItem = modalAdicionarItem.querySelector("#btnAddItem");

    btnAddItem.addEventListener("click", async () => {

        const form = modalAdicionarItem.querySelector("#form-adicionar-item");

        const nomeProduto = form.querySelector("#item-nome").value;

        const valor = form.querySelector("#item-valor").value;

        const quantidade = Number(
            form.querySelector("#item-quantidade").value
        );

        if (!clienteAtual) {
            window.showToast("Selecione um cliente.", "error");
            return;
        }

        if (!produtoAtual) {
            window.showToast("Busque um produto pelo código de barras.", "error");
            return;
        }

        if (
            !nomeProduto ||
            valor === "" ||
            !Number.isFinite(quantidade) ||
            quantidade <= 0
        ) {
            window.showToast(
                "Preencha os campos e informe uma quantidade válida.",
                "error"
            );
            return;
        }

        try {

            const resultado = await adicionarItempCompra(
                clienteAtual.id,
                produtoAtual.id,
                quantidade,
                Number(valor)
            );


            if (resultado) {

                window.showToast("Item adicionado à lista.", "success");

            };

        } catch (error) {

            const mensagem = error.message;

            if (
                mensagem ===
                "Não é possível adicionar produtos a uma compra que não está aberta."
            ) {
                window.showToast(
                    "Esta compra não está aberta e não aceita novos itens.",
                    "error"
                );
            } else if (mensagem === "Compra não encontrada.") {
                window.showToast("Compra não encontrada.", "error");
            } else if (
                mensagem === "Informe todos os dados do produto."
            ) {
                window.showToast("Confira os dados do produto.", "error");
            } else {
                window.showToast(
                    mensagem || "Não foi possível adicionar o produto.",
                    "error"
                );
            }
        }

    });
    eventoInicializado = true;
};




const abrirModalAdicionarItem = (cliente) => {
    inicializarProdutos();

    clienteAtual = cliente;
    document.querySelector("#item-cliente-nome").textContent = cliente.nome;
    modalAdicionarItem.classList.add("show");

    setTimeout(() => {
        document.querySelector("#codigoBarras").focus();
    }, 100);
};

export { abrirModalAdicionarItem, inicializarProdutos, preencherCamposModalProduto };
