import sql from "../conect.js"

export class ComprasRepository {

    async criarCompra(clienteId) {

        const [compra] = await sql`
            INSERT INTO compras (
                cliente_id
            )
            VALUES (
                ${clienteId}
            )    
            RETURNING *    
        `;

        return compra

    }


    async buscarCompraEmAberto(clienteId) {
        const [compra] = await sql`
            SELECT *
            FROM compras
            WHERE cliente_id = ${clienteId}
            AND status = 'aberto'
            LIMIT 1
        `;

        return compra
    }



    async atulizarTotal(compraId) {
        const [compra] = await sql`
            UPDATE compras
            SET total = (
                SELECT COALESCE(
                    SUM(quantidade * preco_unitario),
                    0
                )
                FROM itens_compra
                WHERE compra_id = ${compraId}    
            )
            WHERE id = ${compraId}    
            RETURNING *
        `;

        return compra;
    }

//Essa funcao é utilzada no controller do pagamentos
        async atualizarStatusCompra(compraId) {

        const [compra] = await sql`
        UPDATE compras
        SET status = CASE

            WHEN (
                SELECT COALESCE(SUM(valor_pago), 0)
                FROM pagamentos
                WHERE compra_id = ${compraId}
            ) >= total

            THEN 'pago'

            ELSE 'aberto'

        END

        WHERE id = ${compraId}

        RETURNING *;
    `;

        return compra;

    }
}