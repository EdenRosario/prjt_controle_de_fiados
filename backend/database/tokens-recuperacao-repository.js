import sql from "../conect.js";
export class tokensRopository {

    //finalidade
    //recuperar_usuario
    //recuperar_senha
    //editar_dados

    async atribuirToken({ usuarioId, tokenHash, finalidade }) {

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

    async invalidarToken({ tokenHash, usuarioId, finalidade }) {

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