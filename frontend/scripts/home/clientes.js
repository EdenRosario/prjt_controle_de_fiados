import { API_URL } from "../../config.js";

import {
    criarLinhaCliente,
    limparTabelaClientes,
    removerLinhaCliente,
} from "./tabelaClientes.js";

const modalCliente = document.querySelector("#modal-cadastro");
const btnClear = document.querySelector("#btnClear");
const btnPesquisar = document.querySelector("#btn_pesquisar");
const campoBuscaCliente = document.querySelector("#busca-cpf-home");

const preencherDashboardGeral = async () => {
    try {
        const response = await fetch(`${API_URL}/clients/total`);

        if (!response.ok) {
            throw new Error("Erro ao buscar informações do dashboard");
        }

        const painelTotaldeClientes = document.querySelector(
            "#painelTotaldeClientes",
        );
        const painelTotaldeComprasEmAberto = document.querySelector(
            "#painelTotaldeComprasEmAberto",
        );
        const painelTotalCompraPago = document.querySelector(
            "#painelTotalCompraPago",
        );

        const infoDashboard = await response.json();

        const totalClientes = infoDashboard.totalClientes;
        const totalValorCompras = infoDashboard.totalValorCompras;
        const totalPago = infoDashboard.totalPago;

        totalClientes ? painelTotaldeClientes.innerHTML = totalClientes : painelTotaldeClientes.innerHTML = "Erro";
        totalValorCompras ? painelTotaldeComprasEmAberto.innerHTML = totalValorCompras : painelTotaldeComprasEmAberto.innerHTML = "Erro";
        !Number(totalPago) ? painelTotalCompraPago.innerHTML = totalPago : painelTotalCompraPago.innerHTML = "Erro";

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Erro interno no servidor",
        });
    };
};

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
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: nome,
                    tel: tel,
                    email: email,
                    cpf: cpf,
                }),
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
            method: "DELETE",
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
        window.showToast("Não foi possível remover o cliente.", "error");
    }
};
const loadingClientes = document.querySelector("#loading-clientes");

const buscarCliente = async () => {

    const reqClient = campoBuscaCliente.value.trim();

    if (!reqClient) {
        window.alert(
            "[ERRO] Não foi possível buscar o cliente. Por favor, preencha o campo de pesquisa."
        );
        return;
    }

    try {

        loadingClientes.style.display = "flex";

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

        
        cliente.forEach((c) => {

            criarLinhaCliente(
                c.nome,
                c.cpf,
                c.id,
                c.ativo,
                excluirCliente
            );

        });

    } catch (error) {
        console.log(error);
        window.showToast("Cliente não encontrado.", "error");

        limparBuscaCliente();
    } finally {
        loadingClientes.style.display = "none";
    };
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

preencherDashboardGeral();
export { inicializarClientes };
