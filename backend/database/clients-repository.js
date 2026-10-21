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

        let client

        if (search) {

            const cleanSearch = search.replace(/\D/g, "")

            const isCpf = /^\d+$/.test(cleanSearch)

                if (isCpf) {
                client = await sql`
                     SELECT * FROM clientes
                     WHERE REPLACE(REPLACE(cpf, '.', ''), '-', '') ILIKE ${cleanSearch}
                `
                }else{
                const busca = `%${search}%`

                client = await sql`
                    SELECT * FROM clientes
                    WHERE nome ILIKE ${busca}
                `
                }
        } else {
            client = await sql`
                SELECT * FROM clientes
            `
        }

        return client

    }

    async delete(id) {

        await sql`
            DELETE FROM clientes
            WHERE id = ${id}    
        `

    }
}

