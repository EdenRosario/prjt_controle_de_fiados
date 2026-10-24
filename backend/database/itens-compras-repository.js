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
    
    
    async buscaCompraDetalhadaPorData(clienteId) {
        const dados = await sql`
            SELECT
                c.id AS cliente_id,
                c.nome AS cliente,
                c.cpf,
                co.id AS compra_id,
                co.data,
                co.status,
                co.total,
    
                COALESCE(
                    (
                        SELECT jsonb_agg(
                            jsonb_build_object(
                                'data', grupos.data_dia,
                                'itens', grupos.itens
                            )
                            ORDER BY grupos.data_dia
                        )
                        FROM (
                            SELECT
                                ic.data_item_compra::date AS data_dia,
    
                                jsonb_agg(
                                    jsonb_build_object(
                                        'item_id', ic.id,
                                        'produto_id', p.id,
                                        'produto', p.nome,
                                        'quantidade', ic.quantidade,
                                        'preco_unitario', ic.preco_unitario,
                                        'data_item_compra', ic.data_item_compra,
                                        'subtotal',
                                            ic.quantidade * ic.preco_unitario
                                    )
                                    ORDER BY ic.data_item_compra, ic.id
                                ) AS itens
    
                            FROM itens_compra ic
                            INNER JOIN produtos p
                                ON p.id = ic.produto_id
    
                            WHERE ic.compra_id = co.id
    
                            GROUP BY ic.data_item_compra::date
                        ) AS grupos
                    ),
                    '[]'::jsonb
                ) AS itens_por_dia
    
            FROM clientes c
            INNER JOIN compras co
                ON co.cliente_id = c.id
    
            WHERE c.id = ${clienteId}
              AND co.status = 'aberto'
    
            ORDER BY co.id;
        `;
    
        return dados;
    }
}

