
        const BntLogin = document.querySelector("#BntLogin")

        const ValidarAcesso = () => {
            const Username = document.querySelector("#Username").value
            const Password = document.querySelector("#Password").value

            const Usuarios = JSON.parse(localStorage.getItem("usuarios")) || []

            const UsuarioEncotrado = Usuarios.find(obj => obj.Senha === Password && obj.Usuario === Username)

            if(UsuarioEncotrado){
                console.log("Logado")
                window.location.href = "./paginas/area_de_administração.html"
            }else{
                window.alert("Usuario ou senha invalido!")
            }
            
        }

        
        BntLogin.addEventListener("click", () => {
           ValidarAcesso()
        })