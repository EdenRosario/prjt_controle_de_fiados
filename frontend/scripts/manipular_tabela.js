const BtnPagar = document.querySelector("#BtnPagar")

const AlimentarTabela = () => {

    const DadosClientes = JSON.parse(localStorage.getItem("clientes")) || []

    const Nome_Cliente = document.querySelector("#Nome_Cliente")
    const Valor_Total = document.querySelector("#Valor_Total")
    const Nome = localStorage.getItem("cliente")
    const Tbody = document.querySelector("#TbodyCompras")

    Nome_Cliente.innerHTML = `Cliente ${Nome}`

    Tbody.innerHTML = ""
    DadosClientes.forEach((e) => {
        console.log(e)
    })
    const ClienteEncontrado = DadosClientes.find((cliente) => cliente.nome === Nome)

    if (ClienteEncontrado) {

        let SomaDosItens = 0
        ClienteEncontrado.Array_Compras.map((registros, ind) => {

            let ValConvertido = registros.valor.replace(',', '.')
            SomaDosItens = parseFloat(ValConvertido) * parseFloat(registros.quantidade)

            const TrLinhadaTabela = document.createElement("tr")
            const TdNome = document.createElement("td")
            const TdValor = document.createElement("td")
            const TdQuantidade = document.createElement("td")
            const TdSoma = document.createElement("td")
            const TdDatadaCompra = document.createElement("td")
            console.log()
            TdValor.setAttribute("class", "valores")

            
            TdNome.innerHTML = registros.iten
            TdValor.innerHTML = registros.valor
            TdQuantidade.innerHTML = registros.quantidade
            TdSoma.innerHTML = SomaDosItens.toFixed(2)
            TdDatadaCompra.innerHTML = registros.data

            Valor_Total.setAttribute("id", "TdSubTotal")
            TrLinhadaTabela.append(TdNome, TdValor, TdQuantidade, TdSoma, TdDatadaCompra)
            Tbody.appendChild(TrLinhadaTabela)

            ValorTotal(SomaDosItens)

        })
        

        
    } else {
        console.error("Nenhum iten encontrado")
    }

}

let Sub = 0
const ValorTotal = (valores)=>{
    Sub += valores

    const TdSubtotal = document.querySelector("#TdSubTotal")
    TdSubtotal.innerHTML = Sub.toFixed(2)

}

window.addEventListener("DOMContentLoaded", () => {
    AlimentarTabela()
})

