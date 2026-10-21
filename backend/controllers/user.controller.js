import { DatabasePostgres } from "../database/users-repository.js";
import bcrypt from 'bcrypt'

const userRepository = new DatabasePostgres()

export async function createUser(req, res) {

    console.log(req.body)

    try {

        const { name, date, user, senha, email } = req.body

        if (!name || !date || !user || !senha || !email) {
            return res.status(400).json({ error: "Body incompleto" })
        }

        const senhaHash = await bcrypt.hash(senha, 10)

        await userRepository.create({
            name,
            date,
            user,
            senha: senhaHash,
            email
        })

        return res.status(201).json({ message: "usuario criado com sucesso!" })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: "Erro interno no servidor"
        })
    }
}

export async function validateRecovery(req, res) {

    try {

        if (!req.body) {
            return res.status(400).json({ error: "Body não enviado" })
        }

        const { user, email, date } = req.body

        if (!user || !email || !date) {
            return res.status(400).json({ error: "campos obrigatorios não preenchidos" })
        }

        const result = await userRepository.validateRecovery({
            user,
            email,
            date
        })

        const userSearch = result[0]

        if (!userSearch) {

            return res.status(404).json({ error: "usuario não encontrado" })

        }

        return res.status(200).json({ msg: "usuario autenticado com sucesso", id: userSearch.id })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: "Erro interno no servidor"
        })
    }
}

export async function searchUser(req, res) {

    try {

        if (!req.body) {
            return res.status(400).json({ error: "Body não enviado" })
        }

        const { user, senha } = req.body

        if (!user || !senha) {
            return res.status(400).json({ msg: "campos obrigatorios não preenchidos" })
        }

        const result = await userRepository.searchUser({ user })

        const usuario = result[0]

        if (!usuario) {
            return res.status(404).json({
                error: "usuario não encontrado"
            })
        }

        if (!usuario.senha_hash) {
            return res.status(400).json({
                error: "senha não encontrada"
            })
        }

        const senhaValida = await bcrypt.compare(
            senha,
            usuario.senha_hash
        )

        if (!senhaValida) {
            return res.status(401).json({
                error: "senha incorreta"
            })
        }

        return res.status(200).send({ message: "Login realizado com sucesso" })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: "Erro interno no servidor"
        })
    }
}

export async function update(req, res) {

    try {

        const userId = req.params.id
        const { newSenha } = req.body
        const senhaHash = await bcrypt.hash(newSenha, 10)

        if (!userId || !newSenha) {

            res.status(400).json({ msg: "body vazio" })

        }

        await userRepository.update(userId, {
            newSenha: senhaHash
        })

        return res.status(200).json({ msg: "senha alterada com sucesso" })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: "Erro interno no servidor"
        })
    }
}
