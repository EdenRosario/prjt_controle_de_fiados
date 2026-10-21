import sql from "./conect.js";

await sql`
ALTER TABLE produtos
ADD CONSTRAINT produtos_codigo_barras_unique
UNIQUE (codigo_barras);
`;

console.log("alterações feitas com sucesso!");

await sql.end();