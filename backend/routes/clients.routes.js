
import { Router } from "express";
import * as clientController from "../controllers/clients.controller.js";

const router = Router();

/**
 * @openapi
 * /clients:
 *   post:
 *     summary: Cadastrar novo cliente
 *     description: Realiza o cadastro de um novo cliente no sistema.
 *     tags:
 *       - Clientes
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Eden Carlos
 *               tel:
 *                 type: string
 *                 example: "91999999999"
 *               email:
 *                 type: string
 *                 example: eden@email.com
 *               cpf:
 *                 type: string
 *                 example: "11122233300"
 *
 *     responses:
 *       201:
 *         description: Cliente cadastrado com sucesso.
 *       400:
 *         description: Dados obrigatórios não informados ou inválidos.
 *       500:
 *         description: Erro interno no servidor.
 */
router.post("/", clientController.createCliet);

/**
 * @openapi
 * /clients:
 *   get:
 *     summary: Buscar cliente
 *     description: Busca clientes pelo nome ou CPF.
 *     tags:
 *       - Clientes
 *
 *     parameters:
 *       - in: query
 *         name: nome
 *         schema:
 *           type: string
 *         required: false
 *         description: Nome do cliente.
 *         example: Eden Carlos
 *
 *       - in: query
 *         name: cpf
 *         schema:
 *           type: string
 *         required: false
 *         description: CPF do cliente.
 *         example: "11122233300"
 *
 *     responses:
 *       200:
 *         description: Clientes encontrados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Eden Carlos
 *                   cpf:
 *                     type: string
 *                     example: "11122233300"
 *                   tel:
 *                     type: string
 *                     example: "91999999999"
 *                   email:
 *                     type: string
 *                     example: eden@email.com
 *       400:
 *         description: Parâmetros de busca não informados ou inválidos.
 *       404:
 *         description: Cliente não encontrado.
 *       500:
 *         description: Erro interno no servidor.
 */
router.get("/", clientController.searchClient);

/**
 * @openapi
 * /clients/todos:
 *   get:
 *     summary: Listar todos os clientes
 *     description: Retorna a lista de todos os clientes cadastrados.
 *     tags:
 *       - Clientes
 *
 *     responses:
 *       200:
 *         description: Lista de clientes retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Eden Carlos
 *                   cpf:
 *                     type: string
 *                     example: "11122233300"
 *                   tel:
 *                     type: string
 *                     example: "91999999999"
 *                   email:
 *                     type: string
 *                     example: eden@email.com
 *       404:
 *         description: Não foi possível obter os clientes.
 *       500:
 *         description: Erro interno no servidor.
 */
router.get("/todos", clientController.listarTodosClientes);

/**
 * @openapi
 * /clients/total:
 *   get:
 *     summary: Obter indicadores gerais
 *     description: Retorna os indicadores de clientes, compras e pagamentos.
 *     tags:
 *       - Clientes
 *
 *     responses:
 *       200:
 *         description: Indicadores retornados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalClientes:
 *                   type: integer
 *                   example: 3
 *                 totalValorCompras:
 *                   type: number
 *                   format: double
 *                   example: 2399.19
 *                 totalPago:
 *                   type: number
 *                   format: double
 *                   example: 500.00
 *       404:
 *         description: Não foi possível obter os indicadores.
 *       500:
 *         description: Erro interno no servidor.
 */
router.get(
    "/total",
    clientController.listarTodosClientesTodasComprasTodosPagamentos
);

/**
 * @openapi
 * /clients/{clientId}:
 *   put:
 *     summary: Atualizar dados do cliente
 *     description: Atualiza as informações de um cliente cadastrado.
 *     tags:
 *       - Clientes
 *
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente.
 *         example: 3
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Eden Carlos
 *               cpf:
 *                 type: string
 *                 example: "11122233300"
 *               tel:
 *                 type: string
 *                 example: "91999999999"
 *               email:
 *                 type: string
 *                 example: eden@email.com
 *
 *     responses:
 *       200:
 *         description: Dados do cliente atualizados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 3
 *                 nome:
 *                   type: string
 *                   example: Eden Carlos
 *                 cpf:
 *                   type: string
 *                   example: "11122233300"
 *                 tel:
 *                   type: string
 *                   example: "91999999999"
 *                 email:
 *                   type: string
 *                   example: eden@email.com
 *       400:
 *         description: Dados informados inválidos.
 *       404:
 *         description: Cliente não encontrado.
 *       500:
 *         description: Erro interno no servidor.
 */
router.put("/:clientId", clientController.atualizarDados);

/**
 * @openapi
 * /clients/status/{clientId}:
 *   put:
 *     summary: Alterar status da conta do cliente
 *     description: Ativa ou desativa a conta de um cliente.
 *     tags:
 *       - Clientes
 *
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente.
 *         example: 3
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - acao
 *             properties:
 *               acao:
 *                 type: string
 *                 enum:
 *                   - desativar
 *                   - reativar
 *                 example: desativar
 *
 *     responses:
 *       200:
 *         description: Status da conta atualizado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clienteId:
 *                   type: integer
 *                   example: 3
 *                 nome:
 *                   type: string
 *                   example: Eden Carlos
 *                 cpf:
 *                   type: string
 *                   example: "11122233300"
 *                 tel:
 *                   type: string
 *                   example: "91999999999"
 *                 email:
 *                   type: string
 *                   example: eden@email.com
 *       400:
 *         description: ID não informado, ação não informada ou inválida, ou não foi possível atualizar o status.
 *       404:
 *         description: Cliente não encontrado.
 *       409:
 *         description: Cliente já está com o status solicitado.
 *       500:
 *         description: Erro interno no servidor.
 */
router.put("/status/:clientId", clientController.mudarStatusConta);

export default router;
