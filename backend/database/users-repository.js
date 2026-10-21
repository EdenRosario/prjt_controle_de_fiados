import sql from "../conect.js"

export class DatabasePostgres {

    async create(usuario) {
        const { name, date, user, senha, email } = usuario

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
`
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
        const {user} = usuario

        const result = await sql`

            SELECT * FROM usuarios
            WHERE usuario = ${user}`

        return result    
    }

    async update(id, usuario) {

        const { newSenha } = usuario

        await sql`
             UPDATE usuarios
              SET senha_hash = ${ newSenha }
              WHERE id = ${ id };
        `

    }
}