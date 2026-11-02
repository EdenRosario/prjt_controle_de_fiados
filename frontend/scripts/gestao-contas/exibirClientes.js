import { buscarCliente, listarTodosClientes } from "./clientes.js";
const tamanhoDaPagina = 8;

let clientes = [];
let clienteSelecionado = null;
let clienteEmEdicao = null;
let paginaAtual = 1;

let operacoesDeConta = {
    desativar: null,
    reativar: null,
};

let confirmacaoPendente = null;

const elementos = {
    botaoListar: document.getElementById("btn-listar-clientes"),
    modalListagem: document.getElementById("modal-listar-clientes"),
    buscaPrincipal: document.getElementById("busca-cpf-gestao"),
    buscaModal: document.getElementById("busca-clientes-modal"),
    tabela: document.getElementById("lista-clientes-modal"),
    quantidade: document.getElementById("quantidade-clientes-modal"),
    paginaAtual: document.getElementById("pagina-clientes-atual"),
    paginaAnterior: document.getElementById("pagina-clientes-anterior"),
    paginaProxima: document.getElementById("pagina-clientes-proxima"),
    form: document.getElementById("form-gestao"),
    nome: document.getElementById("gestao-nome"),
    cpf: document.getElementById("gestao-cpf"),
    telefone: document.getElementById("gestao-telefone"),
    email: document.getElementById("gestao-email"),
    status: document.getElementById("gestao-contas-status"),
    botaoLimpar: document.getElementById("btn-limpar-gestao"),
    botaoSalvar: document.getElementById("btn-salvar-gestao"),
    botaoDesativar: document.getElementById("btn-desativar-conta"),
    botaoReativar: document.getElementById("btn-reativar-conta"),
    modalConfirmacao: document.getElementById("modal-confirmar-conta"),
    iconeConfirmacao: document.getElementById("modal-confirmar-conta-icone"),
    tituloConfirmacao: document.getElementById("modal-confirmar-conta-titulo"),
    descricaoConfirmacao: document.getElementById("modal-confirmar-conta-descricao"),
    botaoCancelarConfirmacao: document.getElementById("btn-cancelar-confirmacao"),
    botaoConfirmar: document.getElementById("btn-confirmar-conta"),
    modalEdicao: document.getElementById("modal-editar-cliente"),
    formEdicao: document.getElementById("form-editar-cliente"),
    nomeEdicao: document.getElementById("editar-cliente-nome"),
    cpfEdicao: document.getElementById("editar-cliente-cpf"),
    telefoneEdicao: document.getElementById("editar-cliente-telefone"),
    emailEdicao: document.getElementById("editar-cliente-email"),
};

const exibirToast = (mensagem, tipo = "error") => {
    if (typeof window.showToast === "function") {
        window.showToast(mensagem, tipo);
    }
};

const obterNome = (cliente) => String(cliente?.nome ?? cliente?.name ?? "").trim();
const obterCpf = (cliente) => String(cliente?.cpf ?? "").trim();
const obterTelefone = (cliente) => String(cliente?.telefone ?? cliente?.tel ?? "").trim();
const obterEmail = (cliente) => String(cliente?.email ?? "").trim();

const clienteEstaAtivo = (cliente) => {
    const status = cliente?.ativo ?? cliente?.status;

    if (typeof status === "string") {
        return !["false", "0", "inativo", "inactive"].includes(status.trim().toLowerCase());
    }

    return status !== false && status !== 0;
};

const mesmaPessoa = (primeiro, segundo) => {
    if (!primeiro || !segundo) return false;

    if (primeiro.id !== undefined && segundo.id !== undefined) {
        return String(primeiro.id) === String(segundo.id);
    }

    return obterCpf(primeiro) !== "" && obterCpf(primeiro) === obterCpf(segundo);
};

const atualizarAcoesDaConta = () => {
    const possuiCliente = Boolean(clienteSelecionado);
    const ativo = possuiCliente && clienteEstaAtivo(clienteSelecionado);

    elementos.botaoDesativar.hidden = !possuiCliente || !ativo;
    elementos.botaoReativar.hidden = !possuiCliente || ativo;
};

const atualizarCamposDoFormulario = () => {
    if (!clienteSelecionado) {
        elementos.form.reset();
        elementos.status.textContent = "Selecione um cliente para consultar ou editar seus dados.";
        atualizarAcoesDaConta();
        return;
    }

    elementos.nome.value = obterNome(clienteSelecionado);
    elementos.cpf.value = obterCpf(clienteSelecionado);
    elementos.telefone.value = obterTelefone(clienteSelecionado);
    elementos.email.value = obterEmail(clienteSelecionado);
    elementos.status.textContent = clienteEstaAtivo(clienteSelecionado)
        ? "Conta ativa selecionada."
        : "Conta inativa selecionada.";
    atualizarAcoesDaConta();
};

const filtrarClientes = () => {
    const termo = elementos.buscaModal.value.trim().toLocaleLowerCase("pt-BR");

    if (!termo) return clientes;

    return clientes.filter((cliente) => {
        return obterNome(cliente).toLocaleLowerCase("pt-BR").includes(termo)
            || obterCpf(cliente).replace(/\D/g, "").includes(termo.replace(/\D/g, ""));
    });
};

const criarBotaoDeAcao = (texto, classe, icone, cliente, acao) => {
    const botao = document.createElement("button");
    const elementoIcone = document.createElement("i");

    botao.type = "button";
    botao.className = "modal-listar-clientes-acao " + classe;
    botao.setAttribute("aria-label", texto + " " + obterNome(cliente));
    botao.title = texto;
    botao.dataset.acao = acao;
    botao.dataset.clienteId = String(cliente.id ?? obterCpf(cliente));
    elementoIcone.className = icone;
    elementoIcone.setAttribute("aria-hidden", "true");
    botao.append(elementoIcone, document.createTextNode(texto));

    return botao;
};

const renderizarListaDeClientes = async () => {
    try {
        const clientesCarregados = await listarTodosClientes();

        clientes = Array.isArray(clientesCarregados) ? clientesCarregados : [];
        const listaClientes = clientes;

     
        const totalPaginas = Math.max(
            1,
            Math.ceil(listaClientes.length / tamanhoDaPagina)
        );

        paginaAtual = Math.min(paginaAtual, totalPaginas);

        const inicio = (paginaAtual - 1) * tamanhoDaPagina;

        const exibidos = listaClientes.slice(
            inicio,
            inicio + tamanhoDaPagina
        );

        elementos.tabela.replaceChildren();

        if (exibidos.length === 0) {
            const linha = document.createElement("tr");
            const celula = document.createElement("td");

            celula.colSpan = 3;
            celula.className = "modal-listar-clientes-sem-dados";
            celula.textContent = "Nenhum cliente cadastrado.";

            linha.appendChild(celula);
            elementos.tabela.appendChild(linha);

        } else {
          
            exibidos.forEach((cliente) => {
                const linha = document.createElement("tr");

                const nome = document.createElement("td");
                const cpf = document.createElement("td");
                const acoes = document.createElement("td");

                const grupoAcoes = document.createElement("div");

               
                nome.textContent = obterNome(cliente);
                cpf.textContent = obterCpf(cliente);

                grupoAcoes.className = "modal-listar-clientes-acoes-linha";

                grupoAcoes.appendChild(
                    criarBotaoDeAcao(
                        "Editar",
                        "",
                        "fa-solid fa-pen",
                        cliente,
                        "editar"
                    )
                );

                grupoAcoes.appendChild(
                    clienteEstaAtivo(cliente)
                        ? criarBotaoDeAcao(
                            "Desativar",
                            "modal-listar-clientes-acao--desativar",
                            "fa-solid fa-user-slash",
                            cliente,
                            "desativar"
                        )
                        : criarBotaoDeAcao(
                            "Reativar",
                            "modal-listar-clientes-acao--reativar",
                            "fa-solid fa-user-check",
                            cliente,
                            "reativar"
                        )
                );


                acoes.appendChild(grupoAcoes);

                linha.append(nome, cpf, acoes);

                elementos.tabela.appendChild(linha);
            });
        }

   
        elementos.quantidade.textContent =
            `Exibindo ${exibidos.length} de ${listaClientes.length} cliente` +
            (listaClientes.length === 1 ? "" : "s");

        elementos.paginaAtual.textContent = String(paginaAtual);

        elementos.paginaAnterior.disabled = paginaAtual === 1;

        elementos.paginaProxima.disabled =
            paginaAtual === totalPaginas;

    } catch (erro) {
        console.error("Erro ao renderizar a lista de clientes:", erro);

        elementos.tabela.replaceChildren();

        const linha = document.createElement("tr");
        const celula = document.createElement("td");

        celula.colSpan = 3;
        celula.className = "modal-listar-clientes-sem-dados";
        celula.textContent = "Não foi possível carregar os clientes.";

        linha.appendChild(celula);
        elementos.tabela.appendChild(linha);
    }
};

const localizarCliente = (identificador) => {
    return clientes.find((cliente) => String(cliente.id ?? obterCpf(cliente)) === String(identificador));
};

const fecharModal = (id) => {
    if (typeof window.fecharModal === "function") {
        window.fecharModal(id);
        return;
    }

    document.getElementById(id)?.classList.remove("show");
};

const abrirModalEdicao = (cliente) => {
    if (!cliente || !elementos.modalEdicao || !elementos.formEdicao) return;

    clienteEmEdicao = cliente;
    elementos.formEdicao.reset();
    elementos.nomeEdicao.value = obterNome(cliente);
    elementos.cpfEdicao.value = obterCpf(cliente);
    elementos.telefoneEdicao.value = obterTelefone(cliente);
    elementos.emailEdicao.value = obterEmail(cliente);
    elementos.modalEdicao.classList.add("show");

    requestAnimationFrame(() => elementos.nomeEdicao.focus());
};

const obterDadosDaEdicao = () => ({
    nome: elementos.nomeEdicao.value.trim(),
    cpf: elementos.cpfEdicao.value.trim(),
    telefone: elementos.telefoneEdicao.value.trim(),
    email: elementos.emailEdicao.value.trim(),
});

const salvarEdicaoDoCliente = (evento) => {
    evento.preventDefault();

    if (!clienteEmEdicao) return;

    const dadosDaEdicao = obterDadosDaEdicao();

    // Ponto de integração: conectar aqui a atualização cadastral já definida pela aplicação.
    // Enquanto ela não existir, a interface não confirma nem reflete a alteração na lista. 
    void dadosDaEdicao;
    exibirToast("A integração para salvar alterações cadastrais ainda não está disponível.");
};

const abrirConfirmacao = (cliente, acao) => {
    if (!cliente) {
        exibirToast("Selecione um cliente primeiro.");
        return;
    }

    const nome = obterNome(cliente) || "este cliente";
    const desativacao = acao === "desativar";

    confirmacaoPendente = { cliente, acao };
    elementos.iconeConfirmacao.className = "modal-confirmar-conta-icone " + (desativacao
        ? "modal-confirmar-conta-icone--desativar"
        : "modal-confirmar-conta-icone--reativar");
    elementos.iconeConfirmacao.innerHTML = "<i class=\"fa-solid " + (desativacao ? "fa-user-slash" : "fa-user-check") + "\"></i>";
    elementos.tituloConfirmacao.textContent = desativacao
        ? "Desativar conta do cliente?"
        : "Reativar conta do cliente?";
    elementos.descricaoConfirmacao.textContent = desativacao
        ? "Você está prestes a desativar a conta de " + nome + ". O cliente deixará de aparecer nas operações que exibem apenas contas ativas. O histórico de compras e pagamentos será preservado."
        : "Você deseja reativar a conta de " + nome + "? Após a reativação, o cliente poderá voltar a aparecer nas operações que exibem contas ativas.";
    elementos.botaoConfirmar.className = "btn " + (desativacao ? "btn-danger" : "btn-success");
    elementos.botaoConfirmar.textContent = desativacao ? "Desativar conta" : "Reativar conta";
    elementos.modalConfirmacao.classList.add("show");
    elementos.botaoCancelarConfirmacao.focus();
};

const selecionarCliente = (cliente) => {
    clienteSelecionado = cliente || null;
    atualizarCamposDoFormulario();
};

const definirClientes = (novosClientes) => {
    clientes = Array.isArray(novosClientes) ? novosClientes.filter(Boolean) : [];

    if (clienteSelecionado) {
        clienteSelecionado = clientes.find((cliente) => mesmaPessoa(cliente, clienteSelecionado)) || null;
    }

    paginaAtual = 1;
    atualizarCamposDoFormulario();
    renderizarListaDeClientes();
};

const aplicarResultadoDaOperacao = (clienteOriginal, acao, resultado) => {
    const alterado = resultado && typeof resultado === "object" ? resultado : clienteOriginal;
    const indice = clientes.findIndex((cliente) => mesmaPessoa(cliente, clienteOriginal));
    const clienteAtualizado = { ...alterado, ativo: acao === "reativar" };

    if (indice >= 0) clientes.splice(indice, 1, clienteAtualizado);
    if (clienteSelecionado && mesmaPessoa(clienteSelecionado, clienteOriginal)) clienteSelecionado = clienteAtualizado;

    atualizarCamposDoFormulario();
    renderizarListaDeClientes();
};

const confirmarAlteracaoDeConta = async () => {
    const pendencia = confirmacaoPendente;
    if (!pendencia) return;

    const executar = operacoesDeConta[pendencia.acao];

    if (typeof executar !== "function") {
        fecharModal("modal-confirmar-conta");
        exibirToast("A integração para " + (pendencia.acao === "desativar" ? "desativar" : "reativar") + " contas ainda não está disponível.");
        confirmacaoPendente = null;
        return;
    }

    elementos.botaoConfirmar.disabled = true;

    try {
        const resultado = await executar(pendencia.cliente);
        aplicarResultadoDaOperacao(pendencia.cliente, pendencia.acao, resultado);
        fecharModal("modal-confirmar-conta");
        exibirToast("Conta " + (pendencia.acao === "desativar" ? "desativada" : "reativada") + " com sucesso.", "success");
    } catch (erro) {
        console.error("Não foi possível alterar o status da conta:", erro);
        exibirToast(erro?.message || "Não foi possível alterar o status da conta.");
    } finally {
        elementos.botaoConfirmar.disabled = false;
        confirmacaoPendente = null;
    }
};

elementos.botaoListar.addEventListener("click", () => {
    paginaAtual = 1;
    renderizarListaDeClientes();
    console.log("open modal")
});




const selectClientes = document.getElementById("select-clientes");
const buscaGestao = document.getElementById("busca-cpf-gestao");

let clientesEncontrados = [];

// Busca os clientes enquanto o usuário digita
buscaGestao.addEventListener("input", async () => {
    const termo = buscaGestao.value.trim().toLocaleLowerCase("pt-BR");

    // Limpa os resultados anteriores
    selectClientes.innerHTML = "";
    selectClientes.hidden = true;
    clientesEncontrados = [];

    // Não consulta a API se o campo estiver vazio
    if (!termo) {
        return;
    }

    // Exibe uma opção de carregamento
    const opcaoInicial = document.createElement("option");
    opcaoInicial.value = "";
    opcaoInicial.textContent = "Buscando clientes...";
    selectClientes.appendChild(opcaoInicial);
    selectClientes.hidden = false;

    try {
        const encontrados = await buscarCliente(termo);

        // Evita apresentar resultados inválidos
        if (!Array.isArray(encontrados) || encontrados.length === 0) {
            selectClientes.innerHTML = "";

            const opcaoVazia = document.createElement("option");
            opcaoVazia.value = "";
            opcaoVazia.textContent = "Nenhum cliente encontrado";

            selectClientes.appendChild(opcaoVazia);
            return;
        }

        clientesEncontrados = encontrados;
        selectClientes.innerHTML = "";

        const opcaoPadrao = document.createElement("option");
        opcaoPadrao.value = "";
        opcaoPadrao.textContent = "Selecione um cliente";

        selectClientes.appendChild(opcaoPadrao);

        encontrados.forEach((cliente, indice) => {
            const opcao = document.createElement("option");

            opcao.value = String(indice);
            opcao.textContent = obterNome(cliente);

            selectClientes.appendChild(opcao);
        });

        selectClientes.hidden = false;

    } catch (erro) {
        console.error("Erro ao buscar clientes:", erro);

        selectClientes.innerHTML = "";

        const opcaoErro = document.createElement("option");
        opcaoErro.value = "";
        opcaoErro.textContent = "Erro ao buscar clientes";

        selectClientes.appendChild(opcaoErro);
        selectClientes.hidden = false;
    }
});

// Executado quando o usuário seleciona um cliente  
selectClientes.addEventListener("change", () => {
    const indice = selectClientes.value;

    if (indice === "") {
        return;
    }

    const cliente = clientesEncontrados[Number(indice)];

    if (!cliente) {
        return;
    }

    // Preenche a busca com o nome do cliente selecionado
    buscaGestao.value = obterNome(cliente);

    // Oculta os resultados após a seleção
    selectClientes.hidden = true;

    // Carrega os dados do cliente na tela
    selecionarCliente(cliente);

    console.log("Cliente selecionado:", cliente);
});

elementos.tabela.addEventListener("click", (evento) => {
    const botao = evento.target.closest("[data-acao]");
    if (!botao) return;

    const cliente = localizarCliente(botao.dataset.clienteId);
    if (!cliente) return;

    if (botao.dataset.acao === "editar") {
        fecharModal("modal-listar-clientes");
        abrirModalEdicao(cliente);
        return;
    }

    fecharModal("modal-listar-clientes");
    abrirConfirmacao(cliente, botao.dataset.acao);
});

elementos.paginaAnterior.addEventListener("click", () => {
    paginaAtual -= 1;
    renderizarListaDeClientes();
});

elementos.paginaProxima.addEventListener("click", () => {
    paginaAtual += 1;
    renderizarListaDeClientes();
});

elementos.botaoLimpar.addEventListener("click", () => {
    clienteSelecionado = null;
    atualizarCamposDoFormulario();
});

elementos.botaoSalvar.addEventListener("click", () => {
    exibirToast("A API atual não disponibiliza a atualização cadastral do cliente.");
});

elementos.botaoDesativar.addEventListener("click", () => abrirConfirmacao(clienteSelecionado, "desativar"));
elementos.botaoReativar.addEventListener("click", () => abrirConfirmacao(clienteSelecionado, "reativar"));
elementos.botaoConfirmar.addEventListener("click", confirmarAlteracaoDeConta);
elementos.botaoCancelarConfirmacao.addEventListener("click", () => {
    confirmacaoPendente = null;
});

elementos.formEdicao?.addEventListener("submit", salvarEdicaoDoCliente);

elementos.modalEdicao?.addEventListener("click", (evento) => {
    if (evento.target === elementos.modalEdicao) {
        requestAnimationFrame(() => elementos.botaoListar.focus());
    }
});

document.addEventListener("click", (evento) => {
    if (evento.target.closest("#modal-editar-cliente [data-fechar-modal]")) {
        requestAnimationFrame(() => elementos.botaoListar.focus());
    }
});

document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && elementos.modalEdicao?.classList.contains("show")) {
        requestAnimationFrame(() => elementos.botaoListar.focus());
    }
});

document.addEventListener("gestao-contas:clientes-carregados", (evento) => {
    definirClientes(evento.detail?.clientes ?? evento.detail);
});

document.addEventListener("gestao-contas:cliente-selecionado", (evento) => {
    selecionarCliente(evento.detail?.cliente ?? evento.detail);
});

window.gestaoContas = {
    atualizarClientes: definirClientes,
    selecionarCliente,
    abrirListagem: () => elementos.botaoListar.click(),
    definirOperacoesDeConta: (operacoes = {}) => {
        operacoesDeConta = {
            desativar: typeof operacoes.desativar === "function" ? operacoes.desativar : null,
            reativar: typeof operacoes.reativar === "function" ? operacoes.reativar : null,
        };
    },
};

atualizarCamposDoFormulario();
