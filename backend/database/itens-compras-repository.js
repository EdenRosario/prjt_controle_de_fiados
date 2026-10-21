import sql from "../conect.js";

export class DatabasePostgres {

    async buscarStatuscompra(compraId) {
        const [compra] = await sql`

             SELECT id, status
                 FROM compras
                 WHERE id = ${compraId}

        `;
        return compra
    }

    async adicionarItem({ compraId, produtoId, quantidade, precoUnitario }) {

        const [item] = await sql`
            INSERT INTO itens_compra(
                compra_id,
                produto_id,
                quantidade,
                preco_unitario
            )
            VALUES(
                ${compraId},
                ${produtoId},
                ${quantidade},
                ${precoUnitario}
            )
            RETURNING *        
        `

        return item
    }

    async listarItensDaCompra(compraId) {

        const itens = await sql`
        SELECT
            ic.id,
            p.nome,
            ic.quantidade,
            ic.preco_unitario,
            (ic.quantidade * ic.preco_unitario) AS subtotal

        FROM itens_compra ic

        INNER JOIN produtos p
            ON p.id = ic.produto_id

        WHERE ic.compra_id = ${compraId}
    `;

        return itens;
    }

    async buscarDadosCompraEmAberto(clienteId) {
        const dados = await sql`

                 SELECT
                c.id AS cliente_id,
                c.nome AS cliente,
                c.cpf,

                co.id AS compra_id,
                co.data,
                co.status,
                co.total,

                p.id AS produto_id,
                p.nome AS produto,

                ic.id AS item_id,
                ic.quantidade,
                ic.preco_unitario,

                (
                    ic.quantidade * ic.preco_unitario
                ) AS subtotal

            FROM clientes c

            INNER JOIN compras co
                ON co.cliente_id = c.id

            INNER JOIN itens_compra ic
                ON ic.compra_id = co.id

            INNER JOIN produtos p
                ON p.id = ic.produto_id

            WHERE c.id = ${clienteId}
              AND co.status = 'aberto'

            ORDER BY ic.id;

        `
        return dados
    }
}