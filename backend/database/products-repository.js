import sql from "../conect.js"

export class DatabasePostgres {

    async cadastrarProduto({codigoBarras, nome, preco, setor}) {

          const codigo = String(codigoBarras).trim();
 
         const [existente] = await sql`
        SELECT id
        FROM produtos
        WHERE codigo_barras = ${codigo}
        LIMIT 1
    `;


    if (existente) {
        throw new Error("Já existe um produto cadastrado com esse código de barras.");
    }

        const [produto] = await sql`
            INSERT INTO produtos (codigo_barras, nome, preco, categoria)
            VALUES(
                ${codigoBarras},
                ${nome},
                ${preco},
                ${setor}
             
            )
            RETURNING *    
        `
        return produto
    }

    async listarProdutos() {

        const produtos = await sql`
        SELECT * FROM produtos
    `
        return produtos
    }

    async listarEstoqueBaixo(){

        const produtos = await sql`
            SELECT * FROM produtos 
            WHERE estoque <= estoque_minimo
            ORDER BY estoque ASC
        `
        return produtos
    }

    async buscarProdutoPorId(produtoId) {

        const [produto] = await sql`
             SELECT * FROM produtos
             WHERE id = ${produtoId}
        `
        return produto
    }


    async buscarProdutoPorCodigoBarras(codigoBarras) {
    const [produto] = await sql`
        SELECT *
        FROM produtos
        WHERE codigo_barras = ${codigoBarras}
    `;

    return produto;
}

    async verificarEstoque(produtoIdid, quantidadeSolicitada){
        const estoque= await sql`
            SELECT * FROM produtos
            WHERE id = ${produtoIdid}
            AND estoque >= ${quantidadeSolicitada}

        `
        return estoque
    }

    async atualizarEstoque({produtoId, quantidade}) {

        const [produto] = await sql`
            UPDATE produtos
            SET estoque = estoque - ${quantidade}
            WHERE id = ${produtoId}
            AND estoque >= ${quantidade}
            RETURNING *
        `
        return produto
    }

    async excluirProduto(produtoId){

       const [produto]=  await sql`
            DELETE FROM produtos
            WHERE id = ${produtoId}
            RETURNING * 
        `
        return produto
    }    

}