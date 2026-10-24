import sql from "./conect.js";

await sql`
ALTER TABLE itens_compra
ADD COLUMN data_item_compra TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
`;

console.log("alterações feitas com sucesso!");

await sql.end();