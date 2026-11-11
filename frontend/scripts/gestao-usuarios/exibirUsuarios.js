import { criarUsuario, autentincarDados, mudarSenha, atualizarInformacoes, listarUsuarios } from "./usuarios.js";


let userId = null

const modalCriarAcesso = document.getElementById("modal-criar-acesso");
const formCriarAcesso = document.getElementById("form-criar-acesso");

const restaurarVisibilidadeDasSenhas = (form) => {
    form.querySelectorAll(".senha").forEach((campo) => {
        campo.type = "password";
    });

    form.querySelectorAll(".toggle-senha").forEach((icone) => {
        icone.classList.remove("fa-eye-slash");
        icone.classList.add("fa-eye");
    });
}

const limparFormularioCriarAcesso = () => {
    if (!formCriarAcesso) return;

    formCriarAcesso.reset();
    restaurarVisibilidadeDasSenhas(formCriarAcesso);
}

// Ação para criar o usuário

const senhaForte = (senha) => {

    if (!senha) {
        console.log("Não foi possivel validar a senha");
        return false;
    }

    if (senha.length === 0) {
        window.showToast("[ERRO|] a senha deve conter no minimo 6 caracters", "error")
        return false;
    }

    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]~`]).+$/;

    if (!regex.test(senha)) {
        window.showToast(
            "[ERRO]A senha deve possuir pelo menos uma letra maiúscula, um número e um caractere especial",
            "error"
        );

        return false;
    }

    return true

}

const usuarioForte = (usuario) => {
    if (!usuario) {
        return false;
    }

    if (usuario.length === 0) {
        window.showToast("[ERRO|] O usuario deve conter no minimo 6 caracters", "error")
        return false;
    }

    const regexUsuario = /^(?=.*\d.*\d)[a-z0-9]{8,}$/;

    if (!regexUsuario.test(usuario)) {
        window.showToast(
            "[ERRO] O usuario deve possuir todos caracters de letra em minusculo e no minimo 2 caracters de numero", "error",
            "error"
        );

        return false;
    }

    return true;

}

const cadastrarUsuario = async () => {

    const form = modalCriarAcesso.querySelector("#form-criar-acesso")

    const nome = form.querySelector("#criar-acesso-nome").value

    const data = form.querySelector("#criar-acesso-nascimento").value

    const email = form.querySelector("#criar-acesso-email").value

    const usuario = form.querySelector("#criar-acesso-usuario").value

    const confirmarUsuario = form.querySelector("#criar-acesso-confirmar-usuario").value

    const senha = form.querySelector("#criar-acesso-senha").value

    const confirmarSenha = form.querySelector("#criar-acesso-confirmar-senha").value

    if (!nome) {
        window.showToast("[ERRO!]preencha o campo nome!", "error")
        return;
    }
    if (!data) {
        window.showToast("[ERRO!]preencha o campo data!", "error")
        return;
    }
    if (!email) {
        window.showToast("[ERRO!]preencha o campo email!", "error")
        return;
    }
    if (!usuario) {
        window.showToast("[ERRO!]preencha o campo usuario!", "error")
        return;
    }
    if (!confirmarUsuario) {
        window.showToast("[ERRO!]preencha o campo confirmar usuario!", "error")
        return;
    }
    if (!senha) {
        window.showToast("[ERRO!]preencha o campo senha!", "error")
        return;
    }
    if (!confirmarSenha) {
        window.showToast("[ERRO!]preencha o campo confirmar senha!", "error")
        return;
    }
    if (senha !== confirmarSenha) {
        window.showToast("[ERRO!]Senhas divergentes!", "error")
        return;
    }
    if (usuario !== confirmarUsuario) {
        window.showToast("[ERRO!]Usuarios divergentes!", "error")
        return;
    }


    if (!senhaForte(senha)) {
        return;
    }
    if (!usuarioForte(usuario)) {
        return;
    }

    try {

        const usuarioCriado = await criarUsuario(
            nome,
            data,
            usuario,
            senha,
            email
        )

        window.showToast(usuarioCriado.message, "success")

        form.querySelector("#criar-acesso-nome").value = "";

        form.querySelector("#criar-acesso-nascimento").value = "";

        form.querySelector("#criar-acesso-email").value = "";

        form.querySelector("#criar-acesso-usuario").value = "";

        form.querySelector("#criar-acesso-confirmar-usuario").value = "";

        form.querySelector("#criar-acesso-senha").value = "";

        form.querySelector("#criar-acesso-confirmar-senha").value = "";
    } catch (error) {
        console.error(error)
        return window.showToast(error.message, "error");
    }

}

if (modalCriarAcesso && formCriarAcesso) {



    formCriarAcesso.addEventListener("keydown", (event) => {
        const icone = event.target.closest(".toggle-senha");
        if (!icone || (event.key !== "Enter" && event.key !== " ")) return;

        event.preventDefault();
        icone.click();
    });



    formCriarAcesso.addEventListener("submit", async (event) => {
        event.preventDefault();

        await cadastrarUsuario()

    });

    const aoFechar = new MutationObserver(() => {
        if (!modalCriarAcesso.classList.contains("show")) {
            limparFormularioCriarAcesso();
        }
    });

    aoFechar.observe(modalCriarAcesso, {
        attributes: true,
        attributeFilter: ["class"]
    });
}

// Ação para recuperar o acesso


const validarDadosRecuperarSenha = async () => {

    const usuario = document.getElementById("UsuarioRec").value.trim();
    const nascimento = document.getElementById("NascimentoRec").value;
    const email = document.getElementById("EmailRec").value.trim();

    if (!usuario) {
        window.showToast("[ERRO!] Preencha o campo de usuario", "error")
        return false;
    }

    if (!nascimento) {
        window.showToast("[ERRO!] Preencha o campo data")
        return false;
    }

    if (!email) {
        window.showToast("[ERRO] Preencha o campo de email")
        return false;
    }

    try {


        if (id) {
            window.showToast("[SUCESSO!] Os dados foram validados com sucesso ", "success");
        }

        userId = id;
        return true;
    } catch (error) {
        console.error(error);
        return window.showToast(error.message, "error", false);
    }

}
const criarNovaSenha = async () => {

    const novaSenha = document.getElementById("NovaSenha").value;
    const confirmarNovaSenha = document.getElementById("ConfirmarNovaSenha").value;

    if (!novaSenha || !confirmarNovaSenha) {
        if (typeof window.showToast === "function") {
            window.showToast("[ERRO!]Informe a nova senha e sua confirmação.", "error");
        }
        return false;
    }

    if (novaSenha !== confirmarNovaSenha) {
        if (typeof window.showToast === "function") {
            window.showToast("[ERRO!] Senhas divergentes.", "error");
        }
        return false;
    }

    if (!senhaForte(novaSenha)) {
        return false;
    }

    try {
        console.log(userId)

        console.log(senhaAtualizada)
        window.showToast("[SUCESSO!] Nova senha gerada com suceso!", "success")
        return true
    } catch (error) {
        console.error(error)
        return window.showToast(error.msg, "error" || "Erro ao mudar senha", "error")
    }

}
const modalRecuperarAcesso = document.getElementById("modal-recuperar-acesso");
const formRecuperarAcesso = document.getElementById("form-recuperar-acesso");
const areaValidacaoRecuperar = document.getElementById("recuperar-validacao");

const definirEstadoRecuperacao = (ativo) => {
    if (!formRecuperarAcesso) return;

    const campos = [
        document.getElementById("NovaSenha"),
        document.getElementById("ConfirmarNovaSenha"),
        document.getElementById("BtnRedefinir")
    ];

    campos.forEach((campo) => {
        if (!campo) return;
        campo.disabled = !ativo;
    });

    if (areaValidacaoRecuperar) {
        areaValidacaoRecuperar.classList.toggle("recuperar-validacao--desbloqueado", ativo);
        areaValidacaoRecuperar.classList.toggle("recuperar-validacao--bloqueado", !ativo);
    }
};

const limparFormularioRecuperarAcesso = () => {
    if (!formRecuperarAcesso) return;

    formRecuperarAcesso.reset();
    restaurarVisibilidadeDasSenhas(formRecuperarAcesso);
    definirEstadoRecuperacao(false);
};

if (modalRecuperarAcesso && formRecuperarAcesso) {
    const containerRecuperar = document.getElementById("ContainerRecuperar");
    const mensagemCarregamento = document.getElementById("msg-carregamento");
    const botaoValidar = document.getElementById("BtnValidar");
    const botaoRedefinir = document.getElementById("BtnRedefinir");

    definirEstadoRecuperacao(false);

    formRecuperarAcesso.addEventListener("keydown", (event) => {
        const icone = event.target.closest(".toggle-senha");
        if (!icone || (event.key !== "Enter" && event.key !== " ")) return;

        event.preventDefault();
        icone.click();
    });

    botaoValidar.addEventListener("click", async () => {

        if (containerRecuperar) {
            containerRecuperar.classList.add("carregando");
        }

        if (mensagemCarregamento) {
            mensagemCarregamento.textContent = "validando as informações...";
        }

        window.setTimeout(() => {
            if (containerRecuperar) {
                containerRecuperar.classList.remove("carregando");
            }

            if (!validarDadosRecuperarSenha()) {
                return definirEstadoRecuperacao(false);

            }
            definirEstadoRecuperacao(true);

        })


    });

    botaoRedefinir.addEventListener("click", async () => {

        if (containerRecuperar) {
            containerRecuperar.classList.add("carregando");
        }

        if (mensagemCarregamento) {
            mensagemCarregamento.textContent = "Atualizando senha...";
        }

        window.setTimeout(async () => {

            if (containerRecuperar) {
                containerRecuperar.classList.remove("carregando");
            }

            const sucesso = await criarNovaSenha();

            if (!sucesso) {
                return;
            };

            limparFormularioRecuperarAcesso();
        }, 600);
    });

    const aoFecharRecuperar = new MutationObserver(() => {
        if (!modalRecuperarAcesso.classList.contains("show")) {
            limparFormularioRecuperarAcesso();
        }
    });

    aoFecharRecuperar.observe(modalRecuperarAcesso, {
        attributes: true,
        attributeFilter: ["class"]
    });
}

// Ações para atualizar as informações cadastrais
const modalAtualizarInformacoes = document.getElementById("modal-atualizar-informacoes");
const formAtualizarInformacoes = document.getElementById("form-atualizar-informacoes");
const etapaAutenticacaoAtualizacao = document.getElementById("atualizar-etapa-autenticacao");

const definirEstadoAtualizacao = (ativo) => {
    if (!formAtualizarInformacoes) return;

    [
        document.getElementById("AtualizarEmail"),
        document.getElementById("AtualizarNascimento"),
        document.getElementById("AtualizarNomeCompleto"),
        document.getElementById("BtnSalvarAtualizacao")
    ].forEach((campo) => {
        if (campo) campo.disabled = !ativo;
    });

    if (etapaAutenticacaoAtualizacao) {
        etapaAutenticacaoAtualizacao.classList.toggle("atualizar-etapa--validada", ativo);
    }
};

const limparFormularioAtualizacao = () => {
    if (!formAtualizarInformacoes) return;

    formAtualizarInformacoes.reset();
    restaurarVisibilidadeDasSenhas(formAtualizarInformacoes);
    definirEstadoAtualizacao(false);
};

const validarDadosAtualizarInfo = async () => {

    const usuario = document.getElementById("AtualizarUsuario").value.trim();
    const senhaAtual = document.getElementById("AtualizarSenhaAtual").value;

    console.log({
        usuario,
        senhaAtual
    })

    if (!usuario || !senhaAtual.trim()) {
        if (typeof window.showToast === "function") {
            window.showToast("Informe seu usuário e sua senha atual.", "error");
        }
        return;
    }

    try {

        const autenticacao = await autentincarDados(
            usuario,
            senhaAtual
        )

        console.log(autenticacao)

        window.showToast(autenticacao.msg, "success")

        if (typeof window.showToast === "function") {
            window.showToast("Dados validados com sucesso!", "success");
        }
    } catch (error) {
        console.error(error)
        return window.showToast(error.msg, "error");
    }
}

const atualizarInformacoes = () => {

    const email = document.getElementById("AtualizarEmail").value.trim();
    const nascimento = document.getElementById("AtualizarNascimento").value;
    const nome = document.getElementById("AtualizarNomeCompleto").value.trim();

    if (!email || !nascimento || !nome) {
        if (typeof window.showToast === "function") {
            window.showToast("Preencha e-mail, nome completo e data de nascimento.", "error");
        }
        return;
    }

    if (!email.includes("@")) {
        if (typeof window.showToast === "function") {
            window.showToast("Informe um e-mail válido.", "error");
        }
        return;
    }

    if (typeof window.showToast === "function") {
        window.showToast("Informações atualizadas com sucesso!", "success");
    }

    limparFormularioAtualizacao();

    if (typeof window.fecharModal === "function") {
        window.fecharModal("modal-atualizar-informacoes");
    }

}

document.getElementById("BtnValidarAtualizacao").addEventListener("click", async () => {
    validarDadosAtualizarInfo()
})
if (modalAtualizarInformacoes && formAtualizarInformacoes) {

    definirEstadoAtualizacao(false);

    formAtualizarInformacoes.addEventListener("keydown", (event) => {
        const icone = event.target.closest(".toggle-senha");
        if (!icone || (event.key !== "Enter" && event.key !== " ")) return;

        event.preventDefault();
        icone.click();
    });

    const aoFecharAtualizacao = new MutationObserver(() => {
        if (!modalAtualizarInformacoes.classList.contains("show")) {
            limparFormularioAtualizacao();
        }
    });

    aoFecharAtualizacao.observe(modalAtualizarInformacoes, {
        attributes: true,
        attributeFilter: ["class"]
    });
}

// Ações para mudar a senha do usuário autenticado
const modalMudarSenha = document.getElementById("modal-mudar-senha");
const formMudarSenha = document.getElementById("form-mudar-senha");
const etapaAutenticacaoMudarSenha = document.getElementById("mudar-senha-etapa-autenticacao");

const definirEstadoMudarSenha = (ativo) => {
    if (!formMudarSenha) return;

    [
        document.getElementById("MudarNovaSenha"),
        document.getElementById("MudarConfirmarSenha"),
        document.getElementById("BtnRedefinirMudarSenha")
    ].forEach((campo) => {
        if (campo) campo.disabled = !ativo;
    });

    if (etapaAutenticacaoMudarSenha) {
        etapaAutenticacaoMudarSenha.classList.toggle("atualizar-etapa--validada", ativo);
    }
};

const limparFormularioMudarSenha = () => {
    if (!formMudarSenha) return;

    formMudarSenha.reset();
    restaurarVisibilidadeDasSenhas(formMudarSenha);
    definirEstadoMudarSenha(false);
};

if (modalMudarSenha && formMudarSenha) {
    const botaoValidarMudarSenha = document.getElementById("BtnValidarMudarSenha");
    const botaoRedefinirMudarSenha = document.getElementById("BtnRedefinirMudarSenha");

    definirEstadoMudarSenha(false);

    formMudarSenha.addEventListener("keydown", (event) => {
        const icone = event.target.closest(".toggle-senha");
        if (!icone || (event.key !== "Enter" && event.key !== " ")) return;

        event.preventDefault();
        icone.click();
    });

    botaoValidarMudarSenha.addEventListener("click", () => {
        const usuario = document.getElementById("MudarSenhaUsuario").value.trim();
        const senhaAtual = document.getElementById("MudarSenhaAtual").value;

        if (!usuario || !senhaAtual.trim()) {
            if (typeof window.showToast === "function") {
                window.showToast("Informe seu usuário e sua senha antiga.", "error");
            }
            return;
        }

        definirEstadoMudarSenha(true);

        if (typeof window.showToast === "function") {
            window.showToast("Dados validados com sucesso!", "success");
        }
    });

    botaoRedefinirMudarSenha.addEventListener("click", () => {
        const novaSenha = document.getElementById("MudarNovaSenha").value;
        const confirmarSenha = document.getElementById("MudarConfirmarSenha").value;

        if (!novaSenha || !confirmarSenha) {
            if (typeof window.showToast === "function") {
                window.showToast("Informe a nova senha e sua confirmação.", "error");
            }
            return;
        }

        if (novaSenha !== confirmarSenha) {
            if (typeof window.showToast === "function") {
                window.showToast("As senhas não conferem.", "error");
            }
            return;
        }

        if (typeof window.showToast === "function") {
            window.showToast("Senha redefinida com sucesso!", "success");
        }

        limparFormularioMudarSenha();

        if (typeof window.fecharModal === "function") {
            window.fecharModal("modal-mudar-senha");
        }
    });

    const aoFecharMudarSenha = new MutationObserver(() => {
        if (!modalMudarSenha.classList.contains("show")) {
            limparFormularioMudarSenha();
        }
    });

    aoFecharMudarSenha.observe(modalMudarSenha, {
        attributes: true,
        attributeFilter: ["class"]
    });
}

// Listagem local demonstrativa de usuários do sistema
const modalListaUsuarios = document.getElementById("modal-listar-usuarios");
const tabelaUsuarios = document.getElementById("lista-usuarios-sistema");
const buscaUsuarios = document.getElementById("busca-usuarios-sistema");
const quantidadeUsuarios = document.getElementById("quantidade-usuarios-sistema");
const paginaUsuariosAtual = document.getElementById("usuarios-pagina-atual");
const botaoPaginaUsuariosAnterior = document.getElementById("usuarios-pagina-anterior");
const botaoPaginaUsuariosProxima = document.getElementById("usuarios-pagina-proxima");
const tamanhoPaginaUsuarios = 6;

let usuariosSistema = [
    { id: "usuario-001", nome: "Ana Silva", usuario: "ana.silva", email: "ana.silva@exemplo.com", ativo: true },
    { id: "usuario-002", nome: "Bruno Costa", usuario: "bruno.costa", email: "bruno.costa@exemplo.com", ativo: true },
    { id: "usuario-003", nome: "Carla Souza", usuario: "carla.souza", email: "carla.souza@exemplo.com", ativo: false },
    { id: "usuario-004", nome: "Daniel Oliveira", usuario: "daniel.oliveira", email: "daniel.oliveira@exemplo.com", ativo: true },
    { id: "usuario-005", nome: "Elisa Santos", usuario: "elisa.santos", email: "elisa.santos@exemplo.com", ativo: true },
    { id: "usuario-006", nome: "Felipe Lima", usuario: "felipe.lima", email: "felipe.lima@exemplo.com", ativo: false },
    { id: "usuario-007", nome: "Gabriela Rocha", usuario: "gabriela.rocha", email: "gabriela.rocha@exemplo.com", ativo: true },
    { id: "usuario-008", nome: "Helena Martins", usuario: "helena.martins", email: "helena.martins@exemplo.com", ativo: true },
    { id: "usuario-009", nome: "Igor Ferreira", usuario: "igor.ferreira", email: "igor.ferreira@exemplo.com", ativo: false },
    { id: "usuario-010", nome: "Joana Ribeiro", usuario: "joana.ribeiro", email: "joana.ribeiro@exemplo.com", ativo: true },
    { id: "usuario-011", nome: "Lucas Almeida", usuario: "lucas.almeida", email: "lucas.almeida@exemplo.com", ativo: true },
    { id: "usuario-012", nome: "Marina Carvalho", usuario: "marina.carvalho", email: "marina.carvalho@exemplo.com", ativo: false }
];

let paginaUsuarios = 1;
let usuarioSelecionadoParaAcao = null;

const obterUsuariosFiltrados = () => {
    const termo = buscaUsuarios.value.trim().toLocaleLowerCase("pt-BR");
    if (!termo) return usuariosSistema;

    return usuariosSistema.filter((usuario) =>
        [usuario.nome, usuario.usuario, usuario.email]
            .some((valor) => valor.toLocaleLowerCase("pt-BR").includes(termo))
    );
};

const criarBotaoAcaoUsuario = (rotulo, acao, icone, usuario, classe = "") => {
    const botao = document.createElement("button");
    const elementoIcone = document.createElement("i");

    botao.type = "button";
    botao.className = `gestao-usuarios-acao ${classe}`.trim();
    botao.dataset.acaoUsuario = acao;
    botao.dataset.usuarioId = usuario.id;
    botao.setAttribute("aria-label", `${rotulo} ${usuario.nome}`);
    botao.title = rotulo;

    elementoIcone.className = icone;
    elementoIcone.setAttribute("aria-hidden", "true");
    botao.append(elementoIcone, document.createTextNode(rotulo));
    return botao;
};

const renderizarUsuariosSistema = () => {
    if (!tabelaUsuarios || !buscaUsuarios) return;

    const listaFiltrada = obterUsuariosFiltrados();
    const totalPaginas = Math.max(1, Math.ceil(listaFiltrada.length / tamanhoPaginaUsuarios));
    paginaUsuarios = Math.min(paginaUsuarios, totalPaginas);
    const inicio = (paginaUsuarios - 1) * tamanhoPaginaUsuarios;
    const usuariosExibidos = listaFiltrada.slice(inicio, inicio + tamanhoPaginaUsuarios);
    tabelaUsuarios.replaceChildren();

    if (usuariosExibidos.length === 0) {
        const linha = document.createElement("tr");
        const celula = document.createElement("td");

        celula.colSpan = 5;
        celula.className = "gestao-usuarios-sem-dados";
        celula.textContent = usuariosSistema.length
            ? "Nenhum usuário corresponde à busca."
            : "Nenhum usuário cadastrado.";
        linha.appendChild(celula);
        tabelaUsuarios.appendChild(linha);
    } else {
        usuariosExibidos.forEach((usuario) => {
            const linha = document.createElement("tr");
            const nome = document.createElement("td");
            const login = document.createElement("td");
            const email = document.createElement("td");
            const statusCelula = document.createElement("td");
            const acoes = document.createElement("td");
            const status = document.createElement("span");
            const grupoAcoes = document.createElement("div");

            nome.textContent = usuario.nome;
            login.textContent = usuario.usuario;
            email.textContent = usuario.email;
            status.className = `gestao-usuarios-status ${usuario.ativo ? "gestao-usuarios-status--ativo" : "gestao-usuarios-status--inativo"}`;
            status.textContent = usuario.ativo ? "Ativo" : "Inativo";
            statusCelula.appendChild(status);

            grupoAcoes.className = "gestao-usuarios-acoes-linha";
            grupoAcoes.appendChild(criarBotaoAcao(
                "Redefinir senha",
                "redefinir",
                "fa-solid fa-key",
                usuario
            ));

            grupoAcoes.appendChild(usuario.ativo
                ? criarBotaoAcao("Desativar", "desativar", "fa-solid fa-user-slash", usuario, "gestao-usuarios-acao--desativar")
                : criarBotaoAcao("Reativar", "reativar", "fa-solid fa-user-check", usuario, "gestao-usuarios-acao--reativar"));

            grupoAcoes.appendChild(criarBotaoAcao(
                "Excluir",
                "excluir",
                "fa-solid fa-trash",
                usuario,
                "gestao-usuarios-acao--excluir"
            ));

            acoes.appendChild(grupoAcoes);
            linha.append(nome, login, email, statusCelula, acoes);
            tabelaUsuarios.appendChild(linha);
        });
    }

    quantidadeUsuarios.textContent =
        `Exibindo ${usuariosExibidos.length} de ${listaFiltrada.length} usuários` +
        (listaFiltrada.length !== usuariosSistema.length
            ? ` (total cadastrado: ${usuariosSistema.length})`
            : "");
    paginaUsuariosAtual.textContent = String(paginaUsuarios);
    botaoPaginaUsuariosAnterior.disabled = paginaUsuarios === 1;
    botaoPaginaUsuariosProxima.disabled = paginaUsuarios === totalPaginas;
};

const encontrarUsuarioSistema = (id) =>
    usuariosSistema.find((usuario) => usuario.id === String(id));

const abrirModalAcaoUsuario = (modal, usuario) => {
    if (!modal || !usuario) return;

    usuarioSelecionadoParaAcao = usuario.id;
    modalListaUsuarios.classList.remove("show");
    modal.classList.add("show");
};

const fecharModalAcaoUsuario = (modal) => {
    if (typeof window.fecharModal === "function") {
        window.fecharModal(modal.id);
    } else {
        modal.classList.remove("show");
    }

    if (usuariosSistema.length) modalListaUsuarios.classList.add("show");
};

const abrirConfirmacaoUsuario = (usuario, acao) => {
    const dadosConfirmacao = {
        desativar: {
            modal: document.getElementById("modal-confirmar-desativacao-usuario"),
            descricao: document.getElementById("descricao-confirmar-desativacao"),
            mensagem: `O usuário ${usuario.nome} será desativado e não poderá utilizar o sistema até ser reativado.`
        },
        reativar: {
            modal: document.getElementById("modal-confirmar-reativacao-usuario"),
            descricao: document.getElementById("descricao-confirmar-reativacao"),
            mensagem: `O acesso de ${usuario.nome} será reativado.`
        },
        excluir: {
            modal: document.getElementById("modal-confirmar-exclusao-usuario"),
            descricao: document.getElementById("descricao-confirmar-exclusao"),
            mensagem: `A exclusão do usuário ${usuario.nome} será realizada. Esta ação não poderá ser desfeita.`
        }
    }[acao];

    if (!dadosConfirmacao) return;
    dadosConfirmacao.descricao.textContent = dadosConfirmacao.mensagem;
    abrirModalAcaoUsuario(dadosConfirmacao.modal, usuario);
};

if (modalListaUsuarios && tabelaUsuarios) {
    renderizarUsuariosSistema();

    buscaUsuarios.addEventListener("input", () => {
        paginaUsuarios = 1;
        renderizarUsuariosSistema();
    });

    botaoPaginaUsuariosAnterior.addEventListener("click", () => {
        if (paginaUsuarios > 1) {
            paginaUsuarios -= 1;
            renderizarUsuariosSistema();
        }
    });

    botaoPaginaUsuariosProxima.addEventListener("click", () => {
        const totalPaginas = Math.ceil(obterUsuariosFiltrados().length / tamanhoPaginaUsuarios);
        if (paginaUsuarios < totalPaginas) {
            paginaUsuarios += 1;
            renderizarUsuariosSistema();
        }
    });

    tabelaUsuarios.addEventListener("click", (event) => {
        const botao = event.target.closest("[data-acao-usuario]");
        if (!botao) return;

        const usuario = encontrarUsuarioSistema(botao.dataset.usuarioId);
        if (!usuario) {
            if (typeof window.showToast === "function") {
                window.showToast("Não foi possível localizar o usuário selecionado.", "error");
            }
            return;
        }

        const acao = botao.dataset.acaoUsuario;
        if (acao === "redefinir") {
            const modalRedefinir = document.getElementById("modal-redefinir-senha-usuario");
            const formularioRedefinir = document.getElementById("form-redefinir-senha-usuario");

            formularioRedefinir.reset();
            document.getElementById("redefinir-senha-usuario-id").value = usuario.id;
            document.getElementById("redefinir-senha-usuario-nome").value = `${usuario.nome} (${usuario.usuario})`;
            definirEstadoRedefinicaoUsuario(false);
            restaurarVisibilidadeDasSenhas(formularioRedefinir);
            abrirModalAcaoUsuario(modalRedefinir, usuario);
            return;
        }

        abrirConfirmacaoUsuario(usuario, acao);
    });

    document.getElementById("btn-confirmar-desativacao-usuario").addEventListener("click", () => {
        const usuario = encontrarUsuarioSistema(usuarioSelecionadoParaAcao);
        if (!usuario) return;

        usuario.ativo = false;
        renderizarUsuariosSistema();
        if (typeof window.showToast === "function") window.showToast("Usuário desativado com sucesso.", "success");
        fecharModalAcaoUsuario(document.getElementById("modal-confirmar-desativacao-usuario"));
    });

    document.getElementById("btn-confirmar-reativacao-usuario").addEventListener("click", () => {
        const usuario = encontrarUsuarioSistema(usuarioSelecionadoParaAcao);
        if (!usuario) return;

        usuario.ativo = true;
        renderizarUsuariosSistema();
        if (typeof window.showToast === "function") window.showToast("Usuário reativado com sucesso.", "success");
        fecharModalAcaoUsuario(document.getElementById("modal-confirmar-reativacao-usuario"));
    });

    document.getElementById("btn-confirmar-exclusao-usuario").addEventListener("click", () => {
        const indiceUsuario = usuariosSistema.findIndex(
            (usuario) => usuario.id === usuarioSelecionadoParaAcao
        );
        if (indiceUsuario === -1) return;

        usuariosSistema.splice(indiceUsuario, 1);
        paginaUsuarios = Math.min(
            paginaUsuarios,
            Math.max(1, Math.ceil(obterUsuariosFiltrados().length / tamanhoPaginaUsuarios))
        );
        renderizarUsuariosSistema();
        if (typeof window.showToast === "function") window.showToast("Usuário excluído com sucesso.", "success");
        fecharModalAcaoUsuario(document.getElementById("modal-confirmar-exclusao-usuario"));
    });

    document.querySelectorAll(
        "#modal-confirmar-desativacao-usuario, #modal-confirmar-reativacao-usuario, #modal-confirmar-exclusao-usuario"
    ).forEach((modalConfirmacao) => {
        const aoFecharConfirmacao = new MutationObserver(() => {
            if (!modalConfirmacao.classList.contains("show") && usuariosSistema.length) {
                modalListaUsuarios.classList.add("show");
            }
        });

        aoFecharConfirmacao.observe(modalConfirmacao, {
            attributes: true,
            attributeFilter: ["class"]
        });
    });
}

// Autenticação visual e redefinição da senha de outro usuário
const formRedefinirSenhaUsuario = document.getElementById("form-redefinir-senha-usuario");
const modalRedefinirSenhaUsuario = document.getElementById("modal-redefinir-senha-usuario");
const etapaRedefinicaoUsuario = document.getElementById("btn-autenticar-redefinicao-usuario");

const definirEstadoRedefinicaoUsuario = (ativo) => {
    [
        document.getElementById("redefinir-senha-nova"),
        document.getElementById("redefinir-senha-confirmacao"),
        document.getElementById("btn-confirmar-redefinicao-usuario")
    ].forEach((campo) => {
        if (campo) campo.disabled = !ativo;
    });
};

if (formRedefinirSenhaUsuario && modalRedefinirSenhaUsuario && etapaRedefinicaoUsuario) {
    const botaoConfirmarRedefinicao = document.getElementById("btn-confirmar-redefinicao-usuario");

    definirEstadoRedefinicaoUsuario(false);

    formRedefinirSenhaUsuario.addEventListener("keydown", (event) => {
        const icone = event.target.closest(".toggle-senha");
        if (!icone || (event.key !== "Enter" && event.key !== " ")) return;

        event.preventDefault();
        icone.click();
    });

    etapaRedefinicaoUsuario.addEventListener("click", () => {
        const usuarioId = document.getElementById("redefinir-senha-usuario-id").value;
        if (!usuarioId || !encontrarUsuarioSistema(usuarioId)) {
            if (typeof window.showToast === "function") {
                window.showToast("O usuário selecionado não está mais disponível.", "error");
            }
            return;
        }

        definirEstadoRedefinicaoUsuario(true);
        if (typeof window.showToast === "function") {
            window.showToast("Usuário autenticado para redefinição.", "success");
        }
    });

    botaoConfirmarRedefinicao.addEventListener("click", () => {
        const senha = document.getElementById("redefinir-senha-nova").value;
        const confirmacao = document.getElementById("redefinir-senha-confirmacao").value;
        const usuarioId = document.getElementById("redefinir-senha-usuario-id").value;

        if (!encontrarUsuarioSistema(usuarioId)) {
            if (typeof window.showToast === "function") {
                window.showToast("O usuário selecionado não está mais disponível.", "error");
            }
            return;
        }

        if (!senha || !confirmacao) {
            if (typeof window.showToast === "function") {
                window.showToast("Informe a nova senha e sua confirmação.", "error");
            }
            return;
        }

        if (senha !== confirmacao) {
            if (typeof window.showToast === "function") {
                window.showToast("As senhas não conferem.", "error");
            }
            return;
        }

        if (typeof window.showToast === "function") {
            window.showToast("Senha redefinida com sucesso!", "success");
        }

        formRedefinirSenhaUsuario.reset();
        restaurarVisibilidadeDasSenhas(formRedefinirSenhaUsuario);
        definirEstadoRedefinicaoUsuario(false);
        fecharModalAcaoUsuario(modalRedefinirSenhaUsuario);
    });

    const aoFecharRedefinicaoUsuario = new MutationObserver(() => {
        if (!modalRedefinirSenhaUsuario.classList.contains("show")) {
            formRedefinirSenhaUsuario.reset();
            restaurarVisibilidadeDasSenhas(formRedefinirSenhaUsuario);
            definirEstadoRedefinicaoUsuario(false);
            if (usuariosSistema.length) modalListaUsuarios.classList.add("show");
        }
    });

    aoFecharRedefinicaoUsuario.observe(modalRedefinirSenhaUsuario, {
        attributes: true,
        attributeFilter: ["class"]
    });
}
