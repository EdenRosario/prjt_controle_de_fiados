// import { API_URL } from "./config.js";

const btnLogin = document.querySelector("#bntLogin")
const btnValidarDados = document.querySelector("#BtnValidar")

let toastTimeout;

function msgToast(mensagem, tipo = "success") {
    const toast = document.getElementById("toast");

    if (!toast) {
        console.error("Elemento #toast não encontrado.");
        return;
    }

    clearTimeout(toastTimeout);

    toast.textContent = mensagem;
    toast.classList.remove("toast-success", "toast-error");
    toast.classList.add(
        tipo === "error" ? "toast-error" : "toast-success"
    );
    toast.classList.add("show");

    toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

//funcao para validação de acesso
const validarLogin = async () => {

    const inputUser = document.querySelector("#Iuser");
    const inputPassword = document.querySelector("#Isenha");

    const user = inputUser.value.trim();
    const password = inputPassword.value;

   

        if (!user.length || !password.trim()) {

            msgToast("Por favor, preencha todos os campos.", "error");
            return;
        }


     try {
        const response = await fetch(`http://localhost:3000/auth/login`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                "user": user,
                "senha": password
            })
        });
        let data;

     try {
            data = await response.json();
        } catch {
            data = {};
        }

        // Tratamento de erros
        if (!response.ok) {
            const erro = (data.error || data.message || "").toLowerCase();

            if (erro === "usuario não encontrado") {
                msgToast("Usuário não encontrado.", "error");
                return;
            }

            if (erro === "senha incorreta") {
                msgToast("Senha incorreta. Tente novamente.", "error");
                return;
            }

            msgToast(
                data.error ||
                data.message ||
                "Não foi possível realizar o login.",
                "error"
            );

            return;
        }

        // validar acesso
        if (data.message === "Login realizado com sucesso") {
            msgToast("Login realizado com sucesso!", "success");

            inputUser.value = "";
            inputPassword.value = "";

            setTimeout(() => {
                window.location.href = "./paginas/home.html";
            }, 800);

            return;
        }
        
        msgToast(
            data.message || "Não foi possível confirmar o login.",
            "error"
        );

    } catch (error) {
        console.log(error)
        msgToast(
            "Não foi possível conectar ao servidor. Tente novamente.",
            "error"
        );
    }

}

if(btnLogin){

    btnLogin.addEventListener("click", () => {
        validarLogin()
    });
};



//Validar informações para recuperar a senha e criar acesso admin
document.addEventListener("DOMContentLoaded", () => {

    let idUser = null

    const modalCriar = document.querySelector("#modal-criar-conta")
    const btnCriar = modalCriar.querySelector("#BtnCriarAcesso")

    const modalRecuperar = document.querySelector("#modal-recuperar")
    const btnValidarDados = modalRecuperar.querySelector("#BtnValidar")
    const btnRedefinir = modalRecuperar.querySelector("#BtnRedefinir")

    const createUser = async () => {

        const nome = modalCriar.querySelector("#Inome").value
        const birthDate = modalCriar.querySelector("#Idata").value
        const email = modalCriar.querySelector("#Iemail").value
        const usuario = modalCriar.querySelector("#Iuser").value
        const confirmarUsuario = modalCriar.querySelector("#ConfirmarUsuario").value
        const senha = modalCriar.querySelector("#Isenha").value
        const confirmarSenha = modalCriar.querySelector("#ConfirmarSenha").value

        if (nome.length == 0 || birthDate.length == 0 || email.length == 0 || usuario.length == 0 || confirmarUsuario.length == 0 || senha.length == 0 || confirmarSenha.length == 0) {
            window.alert("[ERRO!!!] Por favor preencha todos os campos")
            return;
        }

        if (usuario !== confirmarUsuario) {
            window.alert("[ERRO!] usuarios divergentes ")
            return;
        }

        if (senha !== confirmarSenha) {
            window.alert("[ERRO!] Senhas divergentes")
            return;
        }

        try {

            const response = await fetch(`http://localhost:3000/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({

                    name: nome,
                    date: birthDate,
                    user: usuario,
                    senha: senha,
                    email: email

                })
            })

            if (response.ok) {
                console.log("ok")
            }

            const data = await response.json()

            if (data.error === "Body incompleto") {
                console.log("body incompleto")
            }

            if (data.message === "usuario criado com sucesso!") {
                console.log("usuario criado com sucesso!")
            }

        } catch (error) {
            console.error(error)
        }

    }

    const redefinirSenha = async () => {

        const novaSenha = modalRecuperar.querySelector("#NovaSenha")
        const confirmarNovaSenha = modalRecuperar.querySelector("#ConfirmarNovaSenha")

        if (novaSenha.value !== confirmarNovaSenha.value) {
            window.alert("SENHAS DIVERGENTES")
            return;
        }

        if (!idUser) {
            window.alert("Sem identificação para este usuario")
            return;
        }

        try {

            const response = await fetch(`http://localhost:3000/auth/${idUser}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    newSenha: novaSenha.value
                })
            })

            if (response.ok) {
                console.log("ok")
            }

            const data = await response.json()

            if (data.msg === "body vazio") {
                console.log("body vazio")
            }

            if (data.msg === "senha alterada com sucesso") {
                console.log("senha alterada com sucesso")
                msgToast("SENHA ALTERADA COM SUCESSO!")

                
                modalRecuperar.querySelector("#NovaSenha").value = ""
                modalRecuperar.querySelector("#ConfirmarNovaSenha").value = ""
            
                modalRecuperar.querySelector("#NovaSenha").disabled = true
                modalRecuperar.querySelector("#ConfirmarNovaSenha").disabled = true
                modalRecuperar.querySelector("#BtnRedefinir").disabled = true

            }

        } catch (error) {
            console.log(error)
        }

        console.log(`id usuario : ${idUser}`)
    }

    const validarDados = async () => {

        const user = modalRecuperar.querySelector("#UsuarioRec").value
        const birthDate = modalRecuperar.querySelector("#NascimentoRec").value
        const email = modalRecuperar.querySelector("#EmailRec").value

        try {

            if (user.length == 0 || birthDate.length == 0 || email.length == 0) {
                window.alert("[ERRO!!!] Por favor preencha todos os campos")
                return;
            }

            const response = await fetch(`http://localhost:3000/auth/recover`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    "user": user,
                    "email": email,
                    "date": birthDate
                })
            })

            const data = await response.json()

            if (response.ok) {
                console.log("ok")
                console.log(data)
            }

            if (data.error === "Body não enviado") {
                console.log("Body não enviado")
            }

            if (data.error === "campos obrigatorios não preenchidos") {
                console.log("preencha todos os campos")
            }

            if (data.error === "usuario não encontrado") {
                console.log("usuario não encontrado")
            }

            if (data.msg === "usuario autenticado com sucesso") {
                console.log("os dados foram validados com sucesso")
                msgToast("OS DADOS FORAM VALIDADOS COM SUCESSO!")
                idUser = data.id

                const novaSenha = modalRecuperar.querySelector("#NovaSenha")
                const confirmarNovaSenha = modalRecuperar.querySelector("#ConfirmarNovaSenha")
                const btnRedefinir = modalRecuperar.querySelector("#BtnRedefinir")

                modalRecuperar.querySelector("#UsuarioRec").value = ""
                modalRecuperar.querySelector("#NascimentoRec").value = ""
                modalRecuperar.querySelector("#EmailRec").value = ""

                novaSenha.disabled = false
                confirmarNovaSenha.disabled = false
                btnRedefinir.disabled = false

            }
        } catch (error) {
            console.log(error)
        }
    }


    btnValidarDados.addEventListener("click", () => {
        validarDados()
    })

    btnRedefinir.addEventListener("click", () => {
        redefinirSenha()
    })

    btnCriar.addEventListener("click", () => {
        console.log("click")
        createUser()
    })

})

document.addEventListener("click", function (e) {
    if (e.target.classList.contains("toggle-senha")) {

        const input = e.target.parentElement.querySelector("input");

        // se estiver desabilitado, não faz nada
        if (input.disabled) return;

        if (input.type === "password") {
            input.type = "text";
            e.target.classList.remove("fa-eye");
            e.target.classList.add("fa-eye-slash");
        } else {
            input.type = "password";
            e.target.classList.remove("fa-eye-slash");
            e.target.classList.add("fa-eye");
        }
    }
});

