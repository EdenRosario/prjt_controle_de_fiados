import { initHome } from './home/home.js';
import { initHistorico } from './historico.js';
import { initGestao } from './gestao.js';

function navegar(idSecao, elementoMenu = null) {
    document.querySelectorAll('.secao').forEach(secao => {
        secao.classList.remove('active');
    });

    document.getElementById(idSecao).classList.add('active');

    // chama script da seção
    switch (idSecao) {
        case 'secao-home':
            initHome();
            break;
        case 'secao-historico':
            initHistorico();
            break;
        case 'secao-contas':
            initGestao();
            break;
    }

    if (elementoMenu) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        elementoMenu.classList.add('active');
    }
}

window.navegar = navegar;