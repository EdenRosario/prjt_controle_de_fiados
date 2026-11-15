import sql from "../conect.js";

export class tokensRopository {

    //finalidade
    //recuperar_usuario
    //recuperar_senha
    //editar_dados

    async criarNovoToken({ usuarioId, tokenHash, finalidade }) {

        if (!usuarioId || !tokenHash || !finalidade) {
            throw new Error("Parametros não informados")
        }

        const [token] = await sql`

        INSERT INTO tokens_recuperacao (
            usuario_id,
            token_hash,
            finalidade,
            expiracao
        )
        VALUES (
            ${usuarioId},
            ${tokenHash},
            ${finalidade},
            NOW() + INTERVAL '15 minutes'
        )
        RETURNING
            id,
            usuario_id,
            finalidade,
            expiracao,
            utilizado,
            criado_em;
    `;

        return token;
    }

    async buscarToken({ tokenHash, usuarioId, finalidade }) {

        if (!tokenHash || !usuarioId || !finalidade) {
            throw new Error("Parametros não informados")
        }

        const [token] = await sql`

        SELECT *
        FROM tokens_recuperacao
        WHERE token_hash = ${tokenHash}
        AND usuario_id = ${usuarioId}
        AND finalidade = ${finalidade}
        AND expiracao > NOW()
        AND utilizado = FALSE;

        `;
        return token

    }

    async buscarTokenPendentePorUsuario({ userId, finalidade }) {

        if (!userId || !finalidade) {
            throw new Error("Parametros não informados")
        }

        const [token] = await sql`
        SELECT *
        FROM tokens_recuperacao
        WHERE usuario_id = ${userId}
          AND finalidade = ${finalidade}
          AND utilizado = false
        LIMIT 1
    `;

        return token;
    }

    async atualizarToken({ tokenNovoHash, tokenPendenteId, finalidade }) {

        if (!tokenNovoHash || !tokenPendenteId || !finalidade) {
            throw new Error("Parametros não informados")
        }

        const [token] = await sql`
        
            UPDATE tokens_recuperacao
            SET token_hash = ${tokenNovoHash},
            expiracao = NOW() + INTERVAL '15 minutes',
            criado_em = NOW()
            WHERE id = ${tokenPendenteId}
               AND finalidade = ${finalidade}
          AND utilizado = FALSE

        RETURNING
            id,
            usuario_id,
            finalidade,
            expiracao,
            utilizado,
            criado_em;
        
        `;
        return token;
    }



    async marcarTokenUtilizado({ tokenHash, usuarioId, finalidade }) {

        if (!tokenHash || !usuarioId || !finalidade) {
            throw new Error("Parametros não informados")
        }

        const [token] = await sql`
        UPDATE tokens_recuperacao
        SET utilizado = TRUE
        WHERE token_hash = ${tokenHash}
        AND usuario_id = ${usuarioId}
        AND finalidade = ${finalidade}
        AND expiracao > NOW()
        AND utilizado = FALSE
        RETURNING id;
    `;

        return token;
    }
}