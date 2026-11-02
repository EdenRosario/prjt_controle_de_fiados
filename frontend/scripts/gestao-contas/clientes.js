import { API_URL } from "../../config.js";

export async function buscarCliente(reqClient) {

    if (!reqClient) {
        window.alert(
            "[ERRO] Não foi possível buscar o cliente. Por favor, preencha o campo de pesquisa."
        );
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/clients?search=${reqClient}`,
        );

        if (!response.ok) {
            throw new Error("Erro ao buscar cliente");
        }

        const cliente = await response.json();

        if (!cliente.length) {
            throw new Error("Cliente não encontrado");
        }

        console.log(cliente)
        return cliente

    } catch (error) {
        console.log(error);
        window.showToast("Cliente não encontrado.", "error");

    }
};

//falta implementar a funcao de atualizar no modal/botao editar e também na sessão principal
export async function listarTodosClientes() {

    try{
        
            const response = await fetch(`${API_URL}/clients/todos`)
        
            if(!response.ok){
                throw new Error("Erro ao buscar clietes")
            }
        
            const clientes = await response.json();
        
            if(!clientes.length){
                 throw new Error("Cliente não encontrado");
            }
        
            return clientes

    }catch(error){

        console.error(error)
        window.showToast("não foi possivel obter clientes", "error");    
    }
}

export async function  atualzizarDados(clientId, nome, cpf, tel, email) {

    if(!clientId){
        console.log("nenhhum id")
        return ;
    }

    if(!nome){
        console.log("nome não enviado")
        return ;
    }

       if(!cpf){
        console.log("cpf não enviado")
        return ;
    }

       if(!tel){
        console.log("telefone não enviado")
        return ;
    }

       if(!email){
        console.log("email não enviado")
        return ;
    }

    try{

        const response = await fetch(`http://localhost:3000/clients/${clientId}`,{

            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nome,
                cpf,
                tel,
                email
            })

        });

        if(!response.ok){
            throw new Error("Erro ao tentar atualizar dados")
        }

        const data = await response.json();

        if(!data){
            throw new Error("nenhum cliente atualizado")
        }

        return data

    }catch(error){
        console.error(error)
        return console.log("Erro ao atualziar cliente")
    } 

}