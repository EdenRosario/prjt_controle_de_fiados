const BtnCriarAcesso = document.querySelector("#BtnCriarAcesso")

const CriarConta = ()=>{
    const Usuarios = JSON.parse(localStorage.getItem("usuarios")) || []
    const Nome = document.querySelector("#Inome").value
    const Data = document.querySelector("#Idata").value
    const Usuario = document.querySelector("#Iuser").value
    const ConfirmarUsuario = document.querySelector("#ConfirmarUsuario").value
    const Senha = document.querySelector("#Isenha").value
    const ConfirmarSenha = document.querySelector("#ConfirmarSenha").value

    if((Nome.length == 0 ) || (Data.length == 0) || (Usuario.length == 0) || (Senha.length == 0)){

        window.alert("[ERRO!!!] Por favor preencha todos os campos")
        return ;
    }
    
    if(ConfirmarUsuario !== Usuario ){

        window.alert("[ERRO] Usuarios divergente!")
        return ;
    }
    
    if(ConfirmarSenha !== Senha){

        window.alert("[ERRO] Senhas divergentes!")
        return ;
    }

        const CadastroUsuario = {
            Nome: Nome,
            Data: Data,
            Usuario:Usuario,
            Senha: Senha
        }

        Usuarios.push(CadastroUsuario)
        localStorage.setItem("usuarios", JSON.stringify(Usuarios))

    
    console.log(`Usuario criado com sucesso ${localStorage.getItem("usuarios")} `)

    document.querySelector("#Inome").value = "" 
    document.querySelector("#Idata").value = ""
    document.querySelector("#Iuser").value = ""
    document.querySelector("#ConfirmarUsuario").value = ""
    document.querySelector("#Isenha").value = ""
    document.querySelector("#ConfirmarSenha").value = ""
    
}

BtnCriarAcesso.addEventListener("click", ()=>{
    CriarConta()
})
document.querySelector("#BtnLimpar").addEventListener("click",()=>{
    localStorage.clear()
})