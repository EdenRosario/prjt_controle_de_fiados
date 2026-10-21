const origensDosModais = new WeakMap();

function abrirModalCadastro() {
    document.getElementById('modal-cadastro').classList.add('show');
}

function abrirModalPagamento() {
    document.getElementById('modal-pagamento').classList.add('show');
}

function fecharModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    modal.classList.remove('show');

    const gatilho = origensDosModais.get(modal);
    if (gatilho) {
        const modalDeOrigem = gatilho.closest('.modal-overlay');
        if (!modalDeOrigem || modalDeOrigem.classList.contains('show')) gatilho.focus();
        origensDosModais.delete(modal);
    }
}

// fechar clicando fora
document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) fecharModal(this.id);
    });
});

// Os cartões são definidos uma vez e reaproveitados na seção e no modal.
const templateAcoesPagamento = document.getElementById('template-pagamentos-acoes');
if (templateAcoesPagamento) {
    document.querySelectorAll('[data-pagamentos-acoes]').forEach(host => {
        if (host.childElementCount === 0) {
            host.append(templateAcoesPagamento.content.cloneNode(true));
        }
    });
}

document.addEventListener('click', event => {
    const botaoFechar = event.target.closest('[data-fechar-modal]');
    if (botaoFechar) {
        const modalAtual = botaoFechar.closest('.modal-overlay');
        if (modalAtual) fecharModal(modalAtual.id);
        return;
    }

    const botaoImprimir = event.target.closest('[data-imprimir-cupom]');
    if (botaoImprimir) {
        const modalCupom = document.getElementById('modal-cupom-compra');
        if (!modalCupom) return;

        modalCupom.classList.add('show');
        document.body.classList.add('imprimindo-cupom');
        window.addEventListener('afterprint', () => {
            document.body.classList.remove('imprimindo-cupom');
            fecharModal('modal-cupom-compra');
        }, { once: true });
        window.print();
        return;
    }

    const gatilho = event.target.closest('[data-modal-alvo]');
    if (!gatilho) return;

    const modalDestino = document.getElementById(gatilho.dataset.modalAlvo);
    if (!modalDestino) return;

    document.querySelectorAll('.modal-overlay.show').forEach(modalAberto => {
        if (modalAberto !== modalDestino) modalAberto.classList.remove('show');
    });

    origensDosModais.set(modalDestino, gatilho);
    modalDestino.classList.add('show');
    modalDestino.querySelector('[data-fechar-modal]')?.focus();
});

document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const modalAberto = document.querySelector('.modal-overlay.show');
    if (modalAberto) fecharModal(modalAberto.id);
});

// global (pra funcionar no HTML)
window.abrirModal = abrirModalCadastro;
window.abrirModalPagamento = abrirModalPagamento;
window.fecharModal = fecharModal;
