import { response } from "express";
import { DatabasePostgres } from "../database/clients-repository.js";

const clientRepository = new DatabasePostgres()

export async function createCliet(req, res) {
    try {

        if (!req.body) {
            res.status(400).send("body vazio")
        }

        const { name, tel, email, cpf } = req.body

        await clientRepository.create({

            name,
            tel,
            email,
            cpf
            
        })

        return res.status(201).json({ message: "cliente criado com sucesso" })

    } catch (error) {

        console.error(error)
        return res.status(500).json({
            error: "Erro interno no servidor"
        })

    }
}

export async function searchClient(req, res) {

    try {

        if (!req.query.search) {
            return res.status(400).send("vazio")
        }

        const search = req.query.search

        const clientSearch = await clientRepository.list(search)

        if (clientSearch.length == 0) {
            return res.status(404).send("cliente não encontrado")
        }

        return res.status(200).json(clientSearch)

    } catch (error) {

        console.error(error)
        return res.status(500).json({
            error: "Erro interno no servidor"
        })

    }


}

export async function deletClient(req, res) {

    try {

        const clientId = req.params.id

        if (!clientId) {
            return res.status(400).json("Nenhum cliente encontrado")
        }

        await clientRepository.delete(clientId)

        return res.status(200).json({ message: "client deletado com sucesso" })

    } catch (error) {

        console.error(error)
        return res.status(500).json({
            error: "Erro interno no servidor"
        })

    }

}
