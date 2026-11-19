import swaggerJsdoc from "swagger-jsdoc";
import {API_URL} from "../../frontend/config.js"
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
                url: API_URL,
                description: "Servidor de desenvolvimento"
            }
        ]
    },

    apis: ["./routes/*.js"]
};

export const swaggerSpec = swaggerJsdoc(options);
