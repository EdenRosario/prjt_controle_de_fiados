const Bnt_Pesquisar = document.querySelector("#Bnt_Pesquisar")
const Tabela_Resp = document.querySelector("#Tabela_Resp")
const Exibir_Conta_Cliente = document.querySelector("#Exibir_Conta")
const BtnCadastrarCliente = document.querySelector("#BtnCadastrarCliente")
const Bnt_Limpar_Pesquisa = document.querySelector("#Bnt_Limpar_Pesquisa")

const Validar_Campos = () => {

    let Nome = document.querySelector("#I_Nome").value
    let Telefone = document.querySelector("#I_Telefone").value
    let Email = document.querySelector("#I_Email").value
    let Cpf = document.querySelector("#I_Cpf").value

    const Dados = [Nome, Telefone, Email, Cpf]

    const Campo_Vazio = Dados.some((ele) => {
        return ele.length <= 0
    })

    if (Campo_Vazio) {
        window.alert("[ERRO!!!] preencha todos os campos!")
        return false
    }
    console.log("Validação OK")
    return true
}

const Limpar_Campos = () => {

    document.querySelector("#I_Nome").value = ""
    document.querySelector("#I_Telefone").value = ""
    document.querySelector("#I_Email").value = ""
    document.querySelector("#I_Cpf").value = ""

}


const Cadastrar_Clientes = () => {

    console.log("Entrou em cadastrar clientes")
    let Nome = document.querySelector("#I_Nome").value
    let Telefone = document.querySelector("#I_Telefone").value
    let Email = document.querySelector("#I_Email").value
    let Cpf = document.querySelector("#I_Cpf").value


    const Cliente_Salvos = JSON.parse(localStorage.getItem("clientes")) || []

    const ClienteExistente = Cliente_Salvos.some((c) => c.cpf === Cpf)

    if (ClienteExistente) {
        window.alert("[Cliente já cadastrado com este CPF!!!]")
        Limpar_Campos()
        return
    }

    const Cliente = {
        nome: Nome,
        telefone: Telefone,
        email: Email,
        cpf: Cpf,
        Array_Compras: [],

        SetMudarNome: function (SetNome) {

            this.nome = SetNome

        },

        SetMudarTelefone: function (SetTelefone) {

            this.telefone = SetTelefone

        },

        SetMudarEmail: function (SetEmail) {

            this.email = SetEmail

        },

        SetMudarCpf: function (SetCpf) {

            this.cpf = SetCpf

        },

        SetAddProduto: function (produto) {

            const existe = this.Array_Compras.some(p => 
                p.iten === produto.iten && p.valor === produto.valor && p.quantidade === produto.quantidade && p.data === produto.data 
            )

            if(!existe){
                this.Array_Compras.push(produto)
            }
            return this.Array_Compras

        }

    }

    Cliente_Salvos.push(Cliente)


    localStorage.setItem("clientes", JSON.stringify(Cliente_Salvos))
    console.log(`Registros salvos ${localStorage.getItem("clientes")}`)


    console.log("cadastrou")
     Limpar_Campos()
 
}

const Exibir_Historico = (nome, indice) => {
    this.nome = ""
    this.nome = nome
    if (this.nome) {
        localStorage.setItem("cliente", nome)
    }
    window.open('historico.html', '_blank')
}

const Data_Atual_da_Compra = () => {
    const Hoje = new Date()

    let Dia = Hoje.getDate()
    let Mes = Hoje.getMonth() + 1
    let Ano = Hoje.getFullYear()

    return `${Dia}/${Mes< 10 ? 0+ Mes: Mes}/${Ano}`
}

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

    cliente.SetAddProduto = function (produto) {

        const existe = this.Array_Compras.some(p => 
             p.iten === produto.iten && p.valor === produto.valor && p.quantidade === produto.quantidade && p.data === produto.data 
        )

        if(!existe){
             this.Array_Compras.push(produto)
        }
               
        return this.Array_Compras
    }

    return cliente
}

const Restaurar_metodo_OBjProduto = (produto) => {

    produto.Informacoes = function () {

        const Info = `

                 Nome do Cliente - ${this.nome_cliente}
                 Produto - ${this.iten}
                 Quantidade - ${this.quantidade}
                 Data da compra - ${this.data}
                
                `

        return Info
    }
    return produto
}

const Cadastrar_Iten = (nome) => {

    let Todos_Clientes_Cadastrados = JSON.parse(localStorage.getItem("clientes")) || []
    let Produtos_Salvos = JSON.parse(localStorage.getItem("produtos")) || []

    Produtos_Salvos.forEach((produto, indice) => {

        Todos_Clientes_Cadastrados = Todos_Clientes_Cadastrados.map((cliente, pos) => {

            if ((produto.nome_cliente === nome) && (produto.nome_cliente === cliente.nome) && (cliente.nome === nome)) {

                cliente = Restaurar_metodos_OBjCliente(cliente)

                let ListaAtualizada = cliente.SetAddProduto(produto)

                ListaAtualizada.forEach((registro, id) => {

                    console.log(
                        `/*Registro*/
                        ${id + 1} \n 
                        ${registro.nome_cliente} \n
                        ${registro.iten} \n
                        ${registro.valor} \n 
                        ${registro.quantidade} \n 
                        ${registro.data}`)
                })
                console.log("------------------------- /  / ---------------------------")
            }
            return cliente
        })
    })
    localStorage.setItem("clientes", JSON.stringify(Todos_Clientes_Cadastrados))
}

const Adicionar_Novo_Iten = (nome) => {

    const Nome = nome

    let Array_Caracteres = nome.split(",")
    let Nome_Completo = Array_Caracteres.join("")
    const Primeiro_Nome = Nome_Completo.split(" ")[0]


    

    const Overlay = document.createElement("div")
    Overlay.setAttribute("class", "Modal_Overlay")


    

    const Div = document.createElement("div")
    Div.setAttribute("class", "Div_Add_Iten")


    

    const Bnt_Fechar_Aba = document.createElement("img")
    Bnt_Fechar_Aba.setAttribute("class", "Icone_Fechar")
    Bnt_Fechar_Aba.setAttribute("src", "../img/icon_fechar.svg")


    

    const Bnt_Cadastrar = document.createElement("button")
    Bnt_Cadastrar.setAttribute("id", "Bnt_Cadastra_Iten")
    Bnt_Cadastrar.innerHTML = "Adicionar"

    const H1 = document.createElement("h1")
    H1.innerHTML = `Cliente ${Primeiro_Nome}`


    

    const P1 = document.createElement("p")

    const Label_Iten = document.createElement("label")
    Label_Iten.setAttribute("for", "I_Iten")
    Label_Iten.innerHTML = "Item "

    const Input_Iten = document.createElement("input")
    Input_Iten.setAttribute("id", "I_Iten")

    P1.append(Label_Iten, Input_Iten)


    const P2 = document.createElement("p")

    const Label_Valor = document.createElement("label")
    Label_Valor.setAttribute("for", "I_Valor")
    Label_Valor.innerHTML = "Valor "

    const Input_Valor = document.createElement("input")
    Input_Valor.setAttribute("id", "I_Valor")

    P2.append(Label_Valor, Input_Valor)

    const P3 = document.createElement("p")

    const Label_Quantidade = document.createElement("label")
    Label_Quantidade.setAttribute("for", "I_Quantidade")
    Label_Quantidade.innerHTML = "Quantidade "

    const Input_Quantidade = document.createElement("input")
    Input_Quantidade.setAttribute("id", "I_Quantidade")

    P3.append(Label_Quantidade, Input_Quantidade)

    const P4 = document.createElement("p")

    const Label_Data = document.createElement("label")
    Label_Data.setAttribute("for", "I_Data")
    Label_Data.innerHTML = "Dia da Compra "

    const Input_Data = document.createElement("input")
    Input_Data.setAttribute("id", "I_Data")
    Input_Data.value = Data_Atual_da_Compra()

    P4.append(Label_Data, Input_Data)


    Div.appendChild(Bnt_Fechar_Aba)
    Div.append(H1, P1, P2, P3, P4, Bnt_Cadastrar)

    Overlay.appendChild(Div)

    document.body.appendChild(Overlay)


    Bnt_Cadastrar.addEventListener("click", () => {

        const Produtos_Salvos =
            JSON.parse(localStorage.getItem("produtos")) || []

        const Iten = Input_Iten.value
        const Valor = Input_Valor.value
        const Quantidade = Input_Quantidade.value
        const Data = Input_Data.value


        const Produto = {

            nome_cliente: Nome,
            iten: Iten,
            valor: Valor,
            quantidade: Quantidade,
            data: Data,

            Informacoes: function () {

                return `
                Nome: ${this.nome_cliente}
                Produto: ${this.iten}
                Quantidade: ${this.quantidade}
                Data: ${this.data}
                `
            }
        }


        Produtos_Salvos.push(Produto)

        localStorage.setItem(
            "produtos",
            JSON.stringify(Produtos_Salvos)
        )


        Cadastrar_Iten(nome)


        Input_Iten.value = ""
        Input_Valor.value = ""
        Input_Quantidade.value = ""

    })


    /* FECHAR MODAL (BOTÃO X)*/

    Bnt_Fechar_Aba.addEventListener("click", () => {

        document.body.removeChild(Overlay)

    })

    //FECHAR CLICANDO FORA
    
    Overlay.addEventListener("click", (e) => {

        if (e.target === Overlay) {

            document.body.removeChild(Overlay)

        }

    })

}

const Exibir_Clientes = (lista) => {

    if (lista) {
        Tabela_Resp.innerHTML = "<ul>"

        lista.forEach((cliente, ind) => {
            Tabela_Resp.innerHTML += ` <li> Cliente  ${cliente.nome}<button id="Bnt_Add(${ind}) "onclick="Adicionar_Novo_Iten('${cliente.nome}')" > Adicionar iten</button>
                 <button id="Bnt_Exibir_Historico" onclick="Exibir_Historico('${cliente.nome}')"> Conta em aberto </button>
            </li> `
        })
        Tabela_Resp.innerHTML += "</ul>"
    } else {
        Tabela_Resp.innerHTML = ""
        return;
    }
}

const Pesquisar_Clientes = () => {

    let termo = document.querySelector("#I_Pesquisar").value
    let Clientes_Salvos = JSON.parse(localStorage.getItem("clientes")) || []

    let resultado = Clientes_Salvos.filter(cliente =>
        cliente.cpf.includes(termo) 
    )
   
    Exibir_Clientes(resultado)
}

const Limpar_Lista = () => {
    console.log("Clickou")
    localStorage.clear()
    Tabela_Resp.innerHTML = ""
}

BtnCadastrarCliente.addEventListener("click", () => {
    if (Validar_Campos()) {
        Cadastrar_Clientes()
    }
})

Bnt_Pesquisar.addEventListener("click", (evt) => {
    Pesquisar_Clientes()
})

Bnt_Limpar_Pesquisa.addEventListener("click", (e) => {
    Limpar_Lista()
})


