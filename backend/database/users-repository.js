import sql from "../conect.js"

export class DatabasePostgres {

    async create(usuario) {
        const { name, date, user, senha, email } = usuario;

        try {
            await sql`
            INSERT INTO usuarios(
                nome,
                usuario,
                senha_hash,
                email,
                data_nascimento
            )
            VALUES(
                ${name},
                ${user},
                ${senha},
                ${email},
                ${date}
            );
        `;

            return {
                sucesso: true,
                mensagem: "Usuário cadastrado com sucesso!"
            };

        } catch (error) {

            if (error.code === "23505") {
                throw new Error("Este nome de usuário ou e-mail  já está cadastrado.");
            }

            throw error;
        }
    }

    async validateRecovery(usuario) {
        const { user, email, date } = usuario

        const result = await sql`
            SELECT * FROM usuarios
            WHERE usuario = ${user}
            AND email = ${email}
            AND DATE(data_nascimento) = ${date};`

        return result
    }

    async searchUser(usuario) {
        const { user } = usuario

        const result = await sql`

            SELECT * FROM usuarios
            WHERE usuario = ${user}`

        return result
    }

    async listarTodosUsuarios() {

        const usuarios = await sql`
            SELECT * FROM usuarios 
            ORDER BY nome
        `;

        return usuarios

    }

    async update(id, usuario) {

        const { newSenha } = usuario

        await sql`
             UPDATE usuarios
              SET senha_hash = ${newSenha}
              WHERE id = ${id};
        `

    }

    async autenticarDados(user) {

        const result = await sql`
        SELECT *
        FROM usuarios
        WHERE usuario = ${user};
    `
        return result[0] || null
    }

    async mudarSenha(id, novaSenha) {

        await sql`
             UPDATE usuarios
              SET senha_hash = ${novaSenha}
              WHERE id = ${id};
        `

    }

    async atualizarInformacoes({ userId, nome, email, nascimento }) {

        const dados = {
            nome,
            email,
            data_nascimento: nascimento
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

        valores.push(userId);

        const query = `
            UPDATE usuarios
            SET ${setClause},
            atualizado_em = CURRENT_TIMESTAMP
            WHERE id = $${valores.length}
            RETURNING *;
        `;

        const resultado = await sql.unsafe(query, valores);

        return resultado[0] ?? null;

    }

}
