import { inicializarClientes } from './clientes.js';
import { inicializarProdutos } from './produtos.js';

let funcionalidadesInicializadas = false;

const inicializarFuncionalidadesHome = () => {
    if (funcionalidadesInicializadas) {
        return;
    }

    inicializarClientes();
    inicializarProdutos();
    funcionalidadesInicializadas = true;
};

const initHome = () => {
    console.log("Home carregada");
    inicializarFuncionalidadesHome();
};

inicializarFuncionalidadesHome();

export { initHome };
