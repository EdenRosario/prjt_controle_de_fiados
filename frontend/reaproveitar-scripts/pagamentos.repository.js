import sql from "../conect.js"

export class DatabasePostgres {

    async registrarPagamento(compraId, valorPago, metodoPagamento) {

        const [pagamento] = await sql`

            INSERT INTO pagamentos (
                compra_id,
                valor_pago,
                metodo_pagamento
            )
            VALUES(
                ${compraId},
                ${valorPago},
                ${metodoPagamento}
            )
            RETURNING *;
        `;

        return pagamento

    }
//fax
    async calcularTotalPago() {

        const [resultado] = await sql`

            SELECT COALESCE(

            SUM(valor_pago),
            0

            ) AS total_pago

           FROM pagamentos

           WHERE compra_id = ${compraId};
        `;

        return Number(resultado.total_pago)
    }

//fax
    async calcularSaldo(compraId) {

        const [resultado] = await sql`
        SELECT
            c.total,
            COALESCE(SUM(p.valor_pago), 0) AS total_pago,
            c.total - COALESCE(SUM(p.valor_pago), 0) AS saldo

        FROM compras AS c

        LEFT JOIN pagamentos AS p
            ON p.compra_id = c.id

        WHERE c.id = ${compraId}

        GROUP BY c.id;
    `;

        return resultado

    }
//fax
    async listarHistoricoPagamento(){
          const pagamentos = await sql`
        SELECT
            id,
            compra_id,
            valor_pago,
            metodo_pagamento,
            data_pagamento,
            criado_em

        FROM pagamentos

        WHERE compra_id = ${compraId}

        ORDER BY data_pagamento ASC;
    `;

    return pagamentos;
    }
//fax
    async resumoPagamentoCompra(compraId) {

    const [resumo] = await sql`
        SELECT
            c.id AS compra_id,
            c.total,

            COALESCE(
                SUM(p.valor_pago),
                0
            ) AS total_pago,

            c.total - COALESCE(
                SUM(p.valor_pago),
                0
            ) AS saldo

        FROM compras AS c

        LEFT JOIN pagamentos AS p
            ON p.compra_id = c.id

        WHERE c.id = ${compraId}

        GROUP BY c.id;
    `;

    return resumo;
}
}