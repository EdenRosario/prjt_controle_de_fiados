import sql from "../conect.js";
export class tokensRopository{

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

    

}