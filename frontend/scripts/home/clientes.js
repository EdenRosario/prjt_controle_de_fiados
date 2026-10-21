import {
    criarLinhaCliente,
    limparTabelaClientes,
    removerLinhaCliente
} from './tabelaClientes.js';

const modalCliente = document.querySelector("#modal-cadastro");
const btnClear = document.querySelector("#btnClear");
const btnPesquisar = document.querySelector("#btn_pesquisar");
const campoBuscaCliente = document.querySelector("#busca-cpf-home");

const limparBuscaCliente = () => {
    campoBuscaCliente.value = "";
};

const cadastrarCliente = async () => {
    const nome = modalCliente.querySelector("#cliente-nome").value;
    const tel = modalCliente.querySelector("#tel").value;
    const email = modalCliente.querySelector("#email").value;
    const cpf = modalCliente.querySelector("#cpf").value;

    if (!nome || !tel || !email || !cpf) {
        window.alert(" [ERRO] Preencha todos os campos! ");
    }

    if (nome && tel && email && cpf) {
        try {
            const response = await fetch("http://localhost:3000/clients", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: nome,
                    tel: tel,
                    email: email,
                    cpf: cpf
                })
            });

            const data = await response.json();
            console.log(`cliente cadastrado com sucesso ${data}`);
        } catch (error) {
            console.log(error);
        }
    }
};

const excluirCliente = async (btn, id) => {
    if (!confirm("Tem certeza que deseja deletar este cliente?")) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/clients/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw Error("Erro ao deletar cliente");
        }

        await response.json();
        console.log("cliente deletado com sucesso");

        removerLinhaCliente(btn);
        window.showToast("Cliente removido!", "success");
        limparBuscaCliente();
        console.log("cliente deletado com sucesso!");
    } catch (error) {
        console.error(error);
        window.showToast(
            "Não foi possível remover o cliente.",
            "error"
        );
    }
};

const buscarCliente = async () => {
    const reqClient = campoBuscaCliente.value.trim();

    if (reqClient) {
        try {
            const response = await fetch(`http://localhost:3000/clients?search=${reqClient}`);

            if (!response.ok) {
                throw new Error("Erro ao buscar cliente");
            }

            const cliente = await response.json();
            const nome = cliente[0].nome;
            const cpf = cliente[0].cpf;
            const id = cliente[0].id;
            const statusCliente = cliente[0].ativo;

            console.log(cliente);

            criarLinhaCliente(nome, cpf, id, statusCliente, excluirCliente);
        } catch (error) {
            console.log(error);
            window.showToast(
                "Cliente não encontrado.",
                "error"
            );

            limparBuscaCliente();
        }
    } else {
        window.alert("[ERRO] Não foi possivel buscar o cliente, por favor preencha o campo de pesquisa");
    }
};

const limparPesquisaClientes = () => {
    limparBuscaCliente();
    limparTabelaClientes();
};

let eventosInicializados = false;

const inicializarClientes = () => {
    if (eventosInicializados) {
        return;
    }

    const btnAddClient = modalCliente.querySelector("#btnAddclient");

    btnAddClient.addEventListener("click", cadastrarCliente);
    btnPesquisar.addEventListener("click", buscarCliente);
    btnClear.addEventListener("click", limparPesquisaClientes);

    eventosInicializados = true;
};

window.deletClient = excluirCliente;

export { inicializarClientes };
