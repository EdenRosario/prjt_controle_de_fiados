import sql from "../conect.js"

export class PagamentosRepository {

    async registrarPagamento({ compraId, valorRecebido, metodoPagamento }) {

        const [pagamento] = await sql`
        WITH dados_compra AS (
            SELECT
                c.id AS compra_id,
                c.total,
                COALESCE(SUM(p.valor_pago), 0) AS total_pago
            FROM compras c
            LEFT JOIN pagamentos p
                ON p.compra_id = c.id
            WHERE c.id = ${compraId}
            GROUP BY c.id, c.total
        ),
        calculo AS (
            SELECT
                compra_id,
                GREATEST(total - total_pago, 0) AS saldo,
                ${valorRecebido }::NUMERIC(10,2) AS recebido,
                ${metodoPagamento}::VARCHAR AS metodo
            FROM dados_compra
        )
        INSERT INTO pagamentos (
            compra_id,
            valor_pago,
            valor_recebido,
            troco,
            metodo_pagamento
        )
        SELECT
            compra_id,
            LEAST(recebido, saldo),
            recebido,
            CASE
                WHEN metodo = 'especie'
                    THEN GREATEST(recebido - saldo, 0)
                ELSE 0
            END,
            metodo
        FROM calculo
        WHERE recebido > 0
          AND (
              recebido <= saldo
              OR metodo = 'especie'
          )
        RETURNING *;
    `;

        if (!pagamento) {
            throw new Error(
                "Pagamento inválido, compra inexistente ou valor superior ao saldo."
            );
        }

        return pagamento;

    }

    async calcularTotalPago(compraId) {

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

    //usado no controller de clientes
   async calcularTotalPagoComprasEmAberto() {
    const [resultado] = await sql`
        SELECT COALESCE(SUM(p.valor_pago), 0) AS total_pago
        FROM pagamentos p
        INNER JOIN compras c
            ON c.id = p.compra_id
        WHERE c.status = 'aberto';
    `;

    return Number(resultado.total_pago);
}

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

    async listarHistoricoPagamento(compraId) {
        const pagamentos = await sql`
        SELECT
            id,
            compra_id,
            valor_pago,
            valor_recebido,
            troco,
            metodo_pagamento,
            data_pagamento,
            criado_em

        FROM pagamentos

        WHERE compra_id = ${compraId}

        ORDER BY data_pagamento ASC;
    `;

        return pagamentos;
    }

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