import {getHistoricoComprasDetalhadoPorData} from "./obterCompras.js"

let clienteAberto = "";
let historicoPorDia = [];

const formatarDataBrasileira = (data) => {
    const correspondencia = String(data ?? "").match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (!correspondencia) {
        return String(data ?? "");
    }

    return correspondencia[3] + "/" + correspondencia[2] + "/" + correspondencia[1];
};

const formatarMoeda = (valor) => {
    const valorNumerico = Number(valor);

    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(Number.isFinite(valorNumerico) ? valorNumerico : 0);
};

const criarElemento = (tag, classe, texto) => {
    const elemento = document.createElement(tag);

    if (classe) {
        elemento.className = classe;
    }

    if (texto !== undefined) {
        elemento.textContent = texto;
    }

    return elemento;
};

const criarIcone = (classe) => {
    const icone = document.createElement("i");
    icone.className = classe;
    icone.setAttribute("aria-hidden", "true");
    return icone;
};

const renderizarMensagemHistorico = (mensagem, carregando = false) => {

    const container = document.getElementById("historico-compras-cards");
    const estado = criarElemento("p", "historico-compras-estado", mensagem);
    estado.setAttribute("role", "status");
    container.replaceChildren(estado);
    container.setAttribute("aria-busy", String(carregando));

};

const criarCardHistorico = (grupo, indice) => {

    const itens = Array.isArray(grupo?.itens) ? grupo.itens : [];
    const card = criarElemento("article", "historico-compra-card");
    const cabecalho = criarElemento("header", "historico-compra-cabecalho");
    const tituloGrupo = criarElemento("div", "historico-compra-titulo-grupo");
    const iconeCalendario = criarElemento("span", "historico-compra-calendario");

    const titulo = criarElemento(
        "h3",
        "historico-compra-titulo",
        "Compra do dia " + formatarDataBrasileira(grupo?.data),
    );

    const quantidade = criarElemento(
        "span",
        "historico-compra-badge",
        itens.length + " " + (itens.length === 1 ? "produto" : "produtos"),
    );

    const lista = criarElemento("div", "historico-compra-itens");

    iconeCalendario.appendChild(criarIcone("fa-regular fa-calendar"));
    tituloGrupo.append(iconeCalendario, titulo);
    cabecalho.append(tituloGrupo, quantidade);
    card.appendChild(cabecalho);

    if (itens.length === 0) {
        lista.appendChild(
            criarElemento("p", "historico-compra-sem-itens", "Nenhum produto registrado nesta data."),
        );
    } else {
        itens.slice(0, 3).forEach((item) => {
            const linha = criarElemento("div", "historico-compra-item");
            const detalhes = criarElemento("div", "historico-compra-item-detalhes");
            const nome = criarElemento("p", "historico-compra-item-nome", item?.produto ?? "");
            const quantidadeItem = criarElemento(
                "span",
                "historico-compra-item-quantidade",
                "Qtd.: " + (item?.quantidade ?? 0),
            );
            const valor = criarElemento(
                "span",
                "historico-compra-item-valor",
                formatarMoeda(item?.subtotal),
            );

            detalhes.append(nome, quantidadeItem);
            linha.append(detalhes, valor);
            lista.appendChild(linha);
        });
    }

    card.appendChild(lista);

    const totalDia = itens.reduce((total, item) => {
        const subtotal = Number(item?.subtotal);
        return total + (Number.isFinite(subtotal) ? subtotal : 0);
    }, 0);
    const rodape = criarElemento("footer", "historico-compra-rodape");
    const resumoTotal = criarElemento("div", "historico-compra-total");
    const rotuloTotal = criarElemento("span", "historico-compra-total-rotulo", "Total do dia");
    const valorTotal = criarElemento("strong", "historico-compra-total-valor", formatarMoeda(totalDia));
    const botaoDetalhes = criarElemento("button", "historico-compra-detalhes", "Ver todos os itens →");

    botaoDetalhes.type = "button";
    botaoDetalhes.dataset.modalAlvo = "modal-historico-compras";
    botaoDetalhes.dataset.historicoIndice = String(indice);
    resumoTotal.append(criarIcone("fa-solid fa-coins"), rotuloTotal, valorTotal);
    rodape.append(resumoTotal, botaoDetalhes);
    card.appendChild(rodape);

    return card;
};

const renderizarHistorico = (grupos) => {
    const container = document.getElementById("historico-compras-cards");
    container.replaceChildren();
    container.setAttribute("aria-busy", "false");

    if (grupos.length === 0) {
        renderizarMensagemHistorico("Nenhum registro de compras foi encontrado para este cliente.");
        return;
    }

    grupos.forEach((grupo, indice) => {
        container.appendChild(criarCardHistorico(grupo, indice));
    });
};

const preencherModalHistorico = (grupo) => {
    const itens = Array.isArray(grupo?.itens) ? grupo.itens : [];
    const corpoTabela = document.getElementById("modal-historico-itens");
    const produtos = new Set();
    let totalUnidades = 0;
    let totalDia = 0;

    corpoTabela.replaceChildren();

    itens.forEach((item) => {
        const linha = document.createElement("tr");
        const nome = criarElemento("td", "", item?.produto ?? "");
        const quantidade = criarElemento("td", "", item?.quantidade ?? 0);
        const subtotal = criarElemento("td", "", formatarMoeda(item?.subtotal));
        const chaveProduto = item?.produto_id !== undefined && item?.produto_id !== null
            ? "id:" + item.produto_id
            : "nome:" + String(item?.produto ?? "").trim().toLocaleLowerCase("pt-BR");
        const quantidadeNumerica = Number(item?.quantidade);
        const subtotalNumerico = Number(item?.subtotal);

        produtos.add(chaveProduto);
        totalUnidades += Number.isFinite(quantidadeNumerica) ? quantidadeNumerica : 0;
        totalDia += Number.isFinite(subtotalNumerico) ? subtotalNumerico : 0;
        linha.append(nome, quantidade, subtotal);
        corpoTabela.appendChild(linha);
    });

    document.getElementById("modal-historico-compras-titulo").textContent =
        "Compra do dia " + formatarDataBrasileira(grupo?.data);
    document.getElementById("modal-historico-compras-cliente").textContent =
        "Cliente: " + clienteAberto;
    document.getElementById("modal-historico-resumo").textContent =
        totalUnidades + (totalUnidades === 1 ? " unidade · " : " unidades · ") +
        produtos.size + (produtos.size === 1 ? " produto" : " produtos");
    document.getElementById("modal-historico-total").textContent = formatarMoeda(totalDia);
};

document.getElementById("historico-compras-cards").addEventListener("click", (evento) => {
    const botao = evento.target.closest(".historico-compra-detalhes");

    if (!botao) {
        return;
    }

    const grupo = historicoPorDia[Number(botao.dataset.historicoIndice)];

    if (grupo) {
        preencherModalHistorico(grupo);
    }
});

function initHistorico() {

    console.log("Histórico carregado");
}

async function verHistorico(nomeCliente, clienteId) {
    clienteAberto = nomeCliente;
    historicoPorDia = [];
    document.getElementById("historico-nome-cliente").textContent = nomeCliente;
    window.navegar('secao-historico');

    try {
        const dados = await getHistoricoComprasDetalhadoPorData(clienteId);
        const grupos = Array.isArray(dados?.[0]?.itens_por_dia)
            ? dados[0].itens_por_dia
            : [];

        historicoPorDia = grupos;
        renderizarHistorico(historicoPorDia);
    } catch (error) {
        console.error("Não foi possível carregar o histórico de compras:", error);
        historicoPorDia = [];
        renderizarMensagemHistorico("Não foi possível carregar o histórico de compras.");
    }
}


function confirmarPagamento() {
    const btn = document.getElementById('btn-confirmar-pag');

    const original = btn.innerHTML;
    btn.innerHTML = "Processando...";
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = original;
        btn.disabled = false;

        window.fecharModal('modal-pagamento');
        window.showToast("Pagamento confirmado!", "success");
        window.navegar('secao-home');
    }, 1500);
}


window.verHistorico = verHistorico;
export { initHistorico, verHistorico };
