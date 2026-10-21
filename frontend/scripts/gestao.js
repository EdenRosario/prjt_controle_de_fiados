
function initGestao() {
    console.log("Gestão carregada");
}

function buscarDadosConta() {
    const busca = document.getElementById('busca-cpf-gestao').value;

    if (busca.length < 3) {
        window.showToast("CPF inválido", "danger");
        return;
    }

    window.showToast("Dados encontrados!", "success");
}

window.buscarDadosConta = buscarDadosConta;

export { initGestao };

