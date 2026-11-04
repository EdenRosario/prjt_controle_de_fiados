import { buscarCliente, listarTodosClientes, atualizarDados, mudarStatusConta } from "./clientes.js";
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

    botao.addEventListener("click", () => {

        if (acao === "editar") {

            const form = elementos.modalEdicao.querySelector("#form-editar-cliente");

            const btnSalvarAlteracoes = form.querySelector("#btnSalvarAlteracoes");

            const updateDadosCliente = async () => {

                try {

                    const id = cliente.id
                    const nome = form.querySelector("#editar-cliente-nome").value.trim();
                    const cpf = form.querySelector("#editar-cliente-cpf").value.trim();
                    const tel = form.querySelector("#editar-cliente-telefone").value.trim();
                    const email = form.querySelector("#editar-cliente-email").value.trim();

                    const clienteAtualizado = await atualizarDados(
                        id,
                        nome,
                        cpf,
                        tel,
                        email
                    )

                    window.showToast(clienteAtualizado.message);

                } catch (error) {
                    window.showToast(error.message, 0);
                    console.error("Erro ao atualizar cliente:", error);
                }

            }

            btnSalvarAlteracoes.addEventListener("click", async () => {
                console.log("clicou")
                updateDadosCliente()
            })

        }

        const mudarStatusClienteLista = async (cliente, acao) => {

            try {
                if (!cliente || !cliente.id) {
                    return console.log("Cliente não informado");
                }

                const clienteAtualizado = await mudarStatusConta(
                    cliente.id,
                    acao
                );

                if (!clienteAtualizado) {
                    return console.log("Nenhuma alteração realizada");
                }

                Object.assign(cliente, clienteAtualizado);

                window.showToast(
                    `Conta ${acao === "reativar" ? "reativada" : "desativada"} com sucesso!`,
                    "success"
                );

                elementos.modalConfirmacao.classList.remove("show");

            } catch (error) {
                console.error("Erro ao alterar status:", error);

                window.showToast(
                    error.message || "Erro ao alterar status da conta.",
                    "error"
                );
            }


        }

        if (acao === "desativar") {
            console.log("Desativar cliente:", cliente);
            console.log("botao desativar criado")

            elementos.botaoConfirmar.onclick = async () => {
                mudarStatusClienteLista(cliente, acao)
            };
        }

        if (acao === "reativar") {
            console.log("Reativar cliente:", cliente);
            console.log("botao reativar criado")
            elementos.botaoConfirmar.onclick = async () => {
                mudarStatusClienteLista(cliente, acao)
            }
        }

    });

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

//reutilizar funcoes para ativar e desativar 

const desativarConta = async () => {

    try {
        if (!confirmacaoPendente) {
            return console.log("confimação pendente e cliente não informados");
        }

        if (!clienteSelecionado) {
            return console.log("nenhum cliente selecionado");
        }

        const clienteId = confirmacaoPendente.cliente.id
        const novoStatus = confirmacaoPendente.acao

        if (!clienteId || clienteId != clienteSelecionado.id) {
            return console.log("id do cliente não informado ou diferente do cliente selecionado");
        }

        if (!novoStatus) {
            return console.log("acao não informada");
        }


        if (novoStatus === "desativar") {

            const clienteAtualizado = await mudarStatusConta(clienteId, novoStatus);

            console.log("status do cliete atualizado", clienteAtualizado);
            Object.assign(clienteSelecionado, clienteAtualizado);
            atualizarIndicadorStatus(clienteSelecionado);
            window.showToast("Conta do cliente desativada!", "error");
            elementos.modalConfirmacao.classList.remove("show");
        }
    } catch (error) {
        console.error("Erro ao desativar cliente", error);
        window.showToast(
            error.message || "Erro ao desativar conta do cliente.",
            "error"
        );
        elementos.modalConfirmacao.classList.remove("show");
    };

}


const reativarConta = async () => {

    try {

        if (!confirmacaoPendente) {
            return console.log("Nenhuma confirmação");
        }

        if (!clienteSelecionado) {
            return  console.log("nenhum cliente selecionado");
        }

        const clienteId = confirmacaoPendente.cliente.id
        const novoStatus = confirmacaoPendente.acao

        if (!clienteId || clienteId != clienteSelecionado.id) {
            return console.log("id do cliente não informado ou diferente do cliente selecionado");
        }

        if (!novoStatus) {
            return console.log("acao não informada");
        }


        if (novoStatus === "reativar") {

            const clienteAtualizado = await mudarStatusConta(clienteId, novoStatus);

            console.log("status do cliete atualizado", clienteAtualizado);
            Object.assign(clienteSelecionado, clienteAtualizado);
            atualizarIndicadorStatus(clienteSelecionado);
            window.showToast("Conta do cliente reativada!", "success");
            elementos.modalConfirmacao.classList.remove("show");
        }
    } catch (error) {
        console.error("Erro ao desativar cliente", error);
        window.showToast(
            error.message || "Erro ao reativar conta do cliente.",
            "error"
        );
        elementos.modalConfirmacao.classList.remove("show");
    };

}

elementos.botaoConfirmar.onclick = async () => confirmacaoPendente.acao == "reativar" ? reativarConta() : desativarConta()

//aqui

const atualizarIndicadorStatus = (cliente) => {

    console.log("cliente do atualizar indicador", cliente)

    const indicador = document.getElementById("indicador-status-cliente");
    const texto = document.getElementById("texto-status-cliente");

    if (!cliente) {
        indicador.hidden = true;
        return;
    }

    indicador.hidden = false;

    if (cliente.ativo === true) {

        indicador.className = "status-cliente-badge ativo";

        indicador.querySelector("i").className = "fa-solid fa-circle-check";

        texto.textContent = "Ativo";

    } else {

        indicador.className = "status-cliente-badge desativado";

        indicador.querySelector("i").className = "fa-solid fa-circle-xmark";

        texto.textContent = "Desativado";
    }
}

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


    selectClientes.innerHTML = "";
    selectClientes.hidden = true;
    clientesEncontrados = [];


    if (!termo) {
        return;
    }


    const opcaoInicial = document.createElement("option");
    opcaoInicial.value = "";
    opcaoInicial.textContent = "Buscando clientes...";
    selectClientes.appendChild(opcaoInicial);
    selectClientes.hidden = false;

    try {
        const encontrados = await buscarCliente(termo);


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


    buscaGestao.value = obterNome(cliente);


    selectClientes.hidden = true;


    selecionarCliente(cliente);

    if (clienteSelecionado) {
        const nome = elementos.form.querySelector("#gestao-nome")
        const cpf = elementos.form.querySelector("#gestao-cpf")
        const telefone = elementos.form.querySelector("#gestao-telefone")
        const email = elementos.form.querySelector("#gestao-email")

        nome.disabled = false
        cpf.disabled = false
        telefone.disabled = false
        email.disabled = false
    } else {
        nome.disabled = true
        cpf.disabled = true
        telefone.disabled = true
        email.disabled = true
    }

    console.log("Cliente selecionado:", cliente);

    atualizarIndicadorStatus(cliente)
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

const updadteDadosCliente = async () => {

    try {

        const id = clienteSelecionado.id
        const nome = elementos.form.querySelector("#gestao-nome").value.trim()
        const cpf = elementos.form.querySelector("#gestao-cpf").value.trim()
        const telefone = elementos.form.querySelector("#gestao-telefone").value.trim();
        const email = elementos.form.querySelector("#gestao-email").value.trim();

        const clienteAtualizado = await atualizarDados(
            id,
            nome,
            cpf,
            telefone,
            email
        )

        window.showToast(clienteAtualizado.message);

    } catch (error) {
        window.showToast(error.message, 0);
        console.error("Erro ao atualizar cliente:", error);
    }
}

elementos.botaoSalvar.addEventListener("click", () => {
    updadteDadosCliente();
});

elementos.botaoDesativar.addEventListener("click", () => abrirConfirmacao(clienteSelecionado, "desativar"));

elementos.botaoReativar.addEventListener("click", () => abrirConfirmacao(clienteSelecionado, "reativar"));

elementos.botaoCancelarConfirmacao.addEventListener("click", () => {
    confirmacaoPendente = null;
});

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
