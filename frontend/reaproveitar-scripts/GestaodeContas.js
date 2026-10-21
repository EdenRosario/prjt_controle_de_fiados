
const BtnSalvarAlteracoes = document.querySelector("#BtnSalvarAlteracoes")
const BtnPesquisar = document.querySelector("#BntPesquisar")
const BtnLimpar = document.querySelector("#BtnLimpar")

const Restaurar_metodos_OBjCliente = (cliente) => {

    cliente.SetMudarNome = function (SetNome) {
        this.nome = SetNome
    }

    cliente.SetMudarTelefone = function (SetTelefone) {
        this.telefone = SetTelefone
    }

    cliente.SetMudarEmail = function (SetEmail) {
        this.email = SetEmail
    }

    cliente.SetMudarCpf = function (SetCpf) {
        this.cpf = SetCpf
    }
}

const ExibirCliente = () => {

    const TodosClientes = JSON.parse(localStorage.getItem("clientes")) || []
    const Cliente = document.querySelector("#Cliente").value
    const INome = document.querySelector("#INome")
    const ITelefone = document.querySelector("#ITelefone")
    const IEmail = document.querySelector("#IEmail")
    const ICPF = document.querySelector("#ICPF")

    TodosClientes.forEach((registros) => {

        if (Cliente === registros.cpf) {

            INome.value = registros.nome
            ITelefone.value = registros.telefone
            IEmail.value = registros.email
            ICPF.value = registros.cpf

            return;
        }
    })

}

const AlterarDados = () => {

    const TodosClientes = JSON.parse(localStorage.getItem("clientes")) || []
    const CpfSelecionado = document.querySelector("#Cliente").value
    const INome = document.querySelector("#INome")
    const ITelefone = document.querySelector("#ITelefone")
    const IEmail = document.querySelector("#IEmail")
    const ICPF = document.querySelector("#ICPF")

    TodosClientes.forEach((Cliente) => {

        if (CpfSelecionado === Cliente.cpf) {

            Cliente.nome = INome.value
            Cliente.telefone = ITelefone.value
            Cliente.email = IEmail.value
            Cliente.cpf = ICPF.value

        }
    })

    localStorage.setItem("clientes", JSON.stringify(TodosClientes))
    alert("Dados atualizados com sucesso")

    const ClienteAtuaizados = JSON.parse(localStorage.getItem("clientes")) || []
    ClienteAtuaizados.forEach((C) => {
        console.log(C)
    })
}

const LimparCampos = () => {
    document.querySelector("#Cliente").value = ""
    document.querySelector("#INome").value = ""
    document.querySelector("#ITelefone").value = ""
    document.querySelector("#IEmail").value = ""
    document.querySelector("#ICPF").value = ""
}

BtnPesquisar.addEventListener("click", () => {
    ExibirCliente()
})

BtnSalvarAlteracoes.addEventListener("click", () => {
    AlterarDados()
    document.querySelector("#Cliente").value = ""
    document.querySelector("#INome").value = ""
    document.querySelector("#ITelefone").value = ""
    document.querySelector("#IEmail").value = ""
    document.querySelector("#ICPF").value = ""
})

BtnLimpar.addEventListener("click",()=>{
    LimparCampos()
})