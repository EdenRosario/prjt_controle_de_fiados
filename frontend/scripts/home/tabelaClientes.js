import { verHistorico } from '../historico.js';
import { abrirModalAdicionarItem } from './produtos.js';

const criarLinhaCliente = (nome, cpf, id, statusCliente, aoExcluir) => {
    console.log(`id recebido ${id}`);
    console.log(`cliente ativo : ${statusCliente}`);

    const tbody = document.querySelector("#tBody");
    const clientExist = tbody.querySelector(`tr[data-cpf="${cpf}"]`);

    if (clientExist) {
        return;
    }

    const tr = document.createElement("tr");
    tr.dataset.cpf = cpf;

    const tdNome = document.createElement("td");
    tdNome.classList.add("nome");
    tdNome.textContent = nome;

    const tdCpf = document.createElement("td");
    tdCpf.textContent = cpf;

    const tdStatus = document.createElement("td");
    tdStatus.id = "status";

    const spanStatus = document.createElement("span");
    spanStatus.style.color = statusCliente ? " var(--success)" : "red";
    spanStatus.style.fontWeight = "500";
    spanStatus.textContent = statusCliente ? "Ativo" : "Inativo";

    tdStatus.appendChild(spanStatus);

    const tdActions = document.createElement("td");
    tdActions.classList.add("actions");

    const openModalAdd = document.createElement("button");
    openModalAdd.className = "btn btn-sm btn-primary";
    openModalAdd.title = "Adicionar Item";
    openModalAdd.innerHTML = `<i class="fa-solid fa-cart-plus"></i>`;
    openModalAdd.addEventListener("click", () => {
        abrirModalAdicionarItem({ id, nome, cpf });
    });

    const btnHistorico = document.createElement("button");
    btnHistorico.className = "btn btn-sm btn-secondary";
    btnHistorico.title = "Ver Histórico";
    btnHistorico.innerHTML = `<i class="fa-solid fa-clock-rotate-left"></i>`;
    btnHistorico.addEventListener("click", () => {
        verHistorico(nome);
    });

    const btnDelete = document.createElement("button");
    btnDelete.className = "btn btn-sm btn-danger";
    btnDelete.title = "Deletar";
    btnDelete.innerHTML = `<i class="fa-solid fa-trash"></i>`;
    btnDelete.addEventListener("click", () => {
        aoExcluir(btnDelete, id);
    });

    tdActions.appendChild(openModalAdd);
    tdActions.appendChild(btnHistorico);
    tdActions.appendChild(btnDelete);

    tr.appendChild(tdNome);
    tr.appendChild(tdCpf);
    tr.appendChild(tdStatus);
    tr.appendChild(tdActions);

    tbody.appendChild(tr);

    return tbody;
};

const removerLinhaCliente = (btn) => {
    const linha = btn.closest('tr');

    if (linha) {
        linha.remove();
    }
};

const limparTabelaClientes = () => {
    document.querySelector("#tBody").innerHTML = "";
};

export { criarLinhaCliente, limparTabelaClientes, removerLinhaCliente };
