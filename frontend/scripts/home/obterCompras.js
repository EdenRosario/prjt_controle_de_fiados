import { API_URL } from "../../config.js";

const loadingClientes = document.querySelector("#loading-historico-compras");

export async function getHistoricoComprasDetalhadoPorData(clienteId) {

    if (!clienteId) {
        throw new Error("nenhum cliente encontrado");
    } else {


        try {

            loadingClientes.style.display = "flex";

            const response = await fetch(
                `${API_URL}/itensCompras/compraDetalhada/` + encodeURIComponent(clienteId),
            );

            const data = await response.json();



            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.error ||
                    "Não foi possível obter detalhes da compra.",
                );
            }

            console.log("dados obtidos", data);

            return data;

        } catch (error) {

            console.error("Erro ao buscar detalhes da compra:", error);
            throw error;

        }

    }


}
