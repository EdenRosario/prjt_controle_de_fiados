import swaggerJsdoc from "swagger-jsdoc";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//Configurações da documentação

const options = {

    definition: {
        openapi: "3.0.0",

        info: {
            title: "API - Controle de Fiados",
            version: "1.0.0",
            description: "Documentação da API do sistema Controle de Fiados"
        },

        servers: [
            {
                url: process.env.SWAGGER_SERVER_LOCAL,
                description: "Servidor local"
            },
            {
                url: process.env.SWAGGER_SERVER_TESTES,
                description: "Servidor de testes"
            },
            {
                url: process.env.SWAGGER_SERVER_PRODUCAO,
                description: "Servidor de produção"
            }
        ]
    },

    apis: [path.join(__dirname, "../routes/*.js")]
};

export const swaggerSpec = swaggerJsdoc(options);
