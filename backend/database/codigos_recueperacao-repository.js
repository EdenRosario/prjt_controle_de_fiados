import sql from "../conect.js";

export class codigosRecuperacao {

    async salvarCodigoRecuperacao(HashCodigoRecuperacao, usuarioId) {

        if (!HashCodigoRecuperacao || !usuarioId) {
            throw new Error("Parametros não informados")
        }

        const [registro] = await sql`
        INSERT INTO codigos_recuperacao (
        codigo_hash,
        expiracao,
        criado_em,
        usuario_id
        )
        VALUES (
        ${HashCodigoRecuperacao},
        NOW() + INTERVAL '15 minutes',
        NOW(),
        ${usuarioId}
        )
        RETURNING
        id,
        usuario_id,
        token_id,
        expiracao,
        validado,
        utilizado,
        tentativas,
        criado_em
        `;
        return registro;
    }

    async buscarCodigoRecuperacaoNaoUtilizado(usuarioId) {

        if(!usuarioId){
            throw new Error("Parametro não informado")
        }

        const [codigo] = await sql`
        SELECT *
        FROM codigos_recuperacao
        WHERE usuario_id = ${usuarioId}
          AND utilizado = FALSE
        ORDER BY criado_em DESC
        LIMIT 1
    `;

        return codigo;
    }

    async atualizarCodigoRecuperacaoNaoUtilizado(codigoHash, codigoId) {

        if(!codigoHash || !codigoId){
            throw new Error ("Parametros não informados")
        }

        const [codigoAtualizado] = await sql`

            UPDATE codigos_recuperacao
            SET
            codigo_hash = ${codigoHash},
            expiracao = NOW() + INTERVAL '15 minutes',
            criado_em = NOW(),
            validado = FALSE,
            utilizado = FALSE,
            tentativas = 0
            WHERE id = ${codigoId}
            AND utilizado = FALSE
            RETURNING 
            id,
            token_id,
            expiracao,
            validado,
            utilizado,
            tentativas,
            criado_em
        `;
        return codigoAtualizado
    }

}