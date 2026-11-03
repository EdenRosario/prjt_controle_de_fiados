import sql from "../conect.js";

export class DatabasePostgres {

    async create(cliente) {
        const { name, tel, email, cpf } = cliente

        await sql`
            INSERT INTO clientes(
                nome,
                telefone,
                email,
                cpf
            )
            VALUES(
                ${name},
                ${tel},
                ${email},
                ${cpf}    
            )    
        `
    }

    async list(search) {
        let client;

        if (search) {
            const cleanSearch = search.replace(/\D/g, "");
            const isCpf = /^\d+$/.test(cleanSearch);

            if (isCpf) {
                client = await sql`
                SELECT * FROM clientes
                WHERE REPLACE(REPLACE(cpf, '.', ''), '-', '') ILIKE ${`%${cleanSearch}%`}
            `;
            } else {
                const busca = `%${search}%`;

                client = await sql`
                SELECT * FROM clientes
                WHERE nome ILIKE ${busca}
            `;
            }
        } else {
            client = await sql`
            SELECT * FROM clientes
        `;
        }

        return client;
    }


    async listarTodosClientes() {
        const clientes = await sql`
        SELECT * FROM clientes
        ORDER BY nome ASC
    `;

        return clientes;
    }

    async listAllClientes() {

        const resultado = await sql`
        SELECT COUNT(*) AS total_clientes
        FROM clientes
    `;
        return Number(resultado[0].total_clientes);

    };


    async atualizarDados({ clienteId, nome, cpf, tel, email }) {
        const dados = {
            nome,
            cpf,
            telefone: tel,
            email
        };

        const colunasAlteradas = [];
        const valores = [];

        for (const [coluna, valor] of Object.entries(dados)) {
            if (valor !== undefined) {
                colunasAlteradas.push(coluna);
                valores.push(valor);
            }
        }

        if (colunasAlteradas.length === 0) {
            return null;
        }

        const setClause = colunasAlteradas
            .map((coluna, index) => `${coluna} = $${index + 1}`)
            .join(', ');

        valores.push(clienteId);

        const query = `
        UPDATE clientes
        SET ${setClause}
        WHERE id = $${valores.length}
        RETURNING *;
    `;

        const resultado = await sql.unsafe(query, valores);

        return resultado[0] ?? null;
    };

    async mudarStatusConta(id, novoStatus) {
        
        const resultado = await sql`
            UPDATE clientes
            SET ativo = ${novoStatus},
            atualizado_em = CURRENT_TIMESTAMP
            WHERE id = ${id}
            RETURNING id, nome, ativo
        `;

        return resultado[0] || null;
    }

};

