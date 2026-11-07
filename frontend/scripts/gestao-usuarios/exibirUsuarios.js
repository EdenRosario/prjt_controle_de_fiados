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
if (modalCriarAcesso && formCriarAcesso) {

    formCriarAcesso.addEventListener("keydown", (event) => {
        const icone = event.target.closest(".toggle-senha");
        if (!icone || (event.key !== "Enter" && event.key !== " ")) return;

        event.preventDefault();
        icone.click();
    });

    formCriarAcesso.addEventListener("submit", (event) => {
        event.preventDefault();

        if (typeof window.showToast === "function") {
            window.showToast("Acesso criado!", "success");
        }

        limparFormularioCriarAcesso();

        if (typeof window.fecharModal === "function") {
            window.fecharModal("modal-criar-acesso");
        }
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

    botaoValidar.addEventListener("click", () => {
        const usuario = document.getElementById("UsuarioRec").value.trim();
        const nascimento = document.getElementById("NascimentoRec").value;
        const email = document.getElementById("EmailRec").value.trim();

        if (!usuario || !nascimento || !email) {
            if (typeof window.showToast === "function") {
                window.showToast("Preencha usuário, data de nascimento e e-mail.", "error");
            }
            return;
        }

        if (!email.includes("@")) {
            if (typeof window.showToast === "function") {
                window.showToast("Informe um e-mail válido.", "error");
            }
            return;
        }

        definirEstadoRecuperacao(true);

        if (typeof window.showToast === "function") {
            window.showToast("Dados validados com sucesso!", "success");
        }
    });

    botaoRedefinir.addEventListener("click", () => {
        const novaSenha = document.getElementById("NovaSenha").value;
        const confirmarNovaSenha = document.getElementById("ConfirmarNovaSenha").value;

        if (!novaSenha || !confirmarNovaSenha) {
            if (typeof window.showToast === "function") {
                window.showToast("Informe a nova senha e sua confirmação.", "error");
            }
            return;
        }

        if (novaSenha !== confirmarNovaSenha) {
            if (typeof window.showToast === "function") {
                window.showToast("As senhas não conferem.", "error");
            }
            return;
        }

        if (containerRecuperar) {
            containerRecuperar.classList.add("carregando");
        }

        if (mensagemCarregamento) {
            mensagemCarregamento.textContent = "Atualizando senha...";
        }

        window.setTimeout(() => {
            if (containerRecuperar) {
                containerRecuperar.classList.remove("carregando");
            }

            if (typeof window.showToast === "function") {
                window.showToast("Senha redefinida com sucesso!", "success");
            }

            limparFormularioRecuperarAcesso();

            if (typeof window.fecharModal === "function") {
                window.fecharModal("modal-recuperar-acesso");
            }
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

