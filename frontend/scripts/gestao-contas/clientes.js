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


        return cliente

    } catch (error) {
        console.log(error);
        window.showToast("Cliente não encontrado.", "error");

    }
};


export async function listarTodosClientes() {

    try {

        const response = await fetch(`${API_URL}/clients/todos`)

        if (!response.ok) {
            throw new Error("Erro ao buscar clietes")
        }

        const clientes = await response.json();

        if (!clientes.length) {
            throw new Error("Cliente não encontrado");
        }

        return clientes

    } catch (error) {
        console.error(error)
        window.showToast("não foi possivel obter clientes", "error");
    }
}

export async function atualizarDados(clientId, nome, cpf, tel, email) {

    if (!clientId) {
        throw new Error("ID do cliente não informado.");
    };

    if (!nome || !cpf || !tel || !email) {
        throw new Error("Preencha todos os campos obrigatórios.");
    };

    try {

        const response = await fetch(`${API_URL}/clients/${clientId}`, {

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

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || data.error || "Erro ao atualizar cliente."
            );
        }

        return data;

    } catch (error) {
        console.error("Erro ao atualizar cliente:", error);
        throw error;
    }

}

export async function mudarStatusConta(clientId, novoStatus) {

    if (!clientId || !novoStatus) {
        throw new Error("Preencha todos os campos")
    }

    try {

        const response = await fetch(`${API_URL }/clients/status/${clientId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                novoStatus
            })
        })

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || data.error || "Erro ao atualizar status do cliente."
            );
        }

        return data;

    } catch (error) {
        console.error("Erro ao atualizar status cliente:", error);
        throw error;
    }

}