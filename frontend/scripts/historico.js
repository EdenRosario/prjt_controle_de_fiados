let clienteAberto = "";

function initHistorico() {
    console.log("Histórico carregado");
}

function verHistorico(nomeCliente) {
    clienteAberto = nomeCliente;

    document.getElementById('historico-nome-cliente').innerText =
        "Histórico de Compras - " + nomeCliente;

    window.navegar('secao-historico');
}

function confirmarPagamento() {
    const btn = document.getElementById('btn-confirmar-pag');

    const original = btn.innerHTML;
    btn.innerHTML = "Processando...";
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = original;
        btn.disabled = false;

        window.fecharModal('modal-pagamento');
        window.showToast("Pagamento confirmado!", "success");
        window.navegar('secao-home');
    }, 1500);
}

export { initHistorico, verHistorico };