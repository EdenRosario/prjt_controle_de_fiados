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

        return res.status(200).send({
        message: "Login realizado com sucesso",
        usuario : {
                id : usuario.id
        } })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: "Erro interno no servidor"
        })
    }
}

export const listarTodosUsuarios = async (req, res)=>{

    try{

        const usuarios = await userRepository();

        if(!usuarios){
            return res.status(404).json({
                msg : "Falha na busca dos usuarios"
            })
        }

        return res.status(200).json(usuarios)

    }catch(error){
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

export const autentincarDados = async (req, res) => {

    try {

        if (!req.body) {
            return res.status(400).json({
                msg: "body vazio"
            })
        }


        const { user, senhaAntiga } = req.body

        if (!user) {
            return res.status(400).json({
                msg: "Usuario não recebido"
            })
        }

        if (!senhaAntiga) {
            return res.status(400).json({
                msg: "Senha antiga não recebida"
            })
        }


        const dadosUsuario = await userRepository.autenticarDados(user)

        if (!dadosUsuario) {
            return res.status(404).json({
                msg: "Usuario não encontrado na base de dados"
            })
        }

        return res.status(200).json(dadosUsuario.id)
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: "Erro intenrno no servidor..."
        })
    }

}

export const mudarSenha = async (req, res) => {

    try {
        const userId = req.params.userId

        if (!userId) {
            return res.status(400).json({
                msg: "ID do usuario não recebido"
            })
        }

        const novaSenha = req.body

        if (!novaSenha) {
            return res.status(400).json({
                msg: "A nova senha não foi recebida"
            })
        }

        const senhaHash = await bcrypt.hash(novaSenha, 10)

        const sucesso = await userRepository.mudarSenha(userId, senhaHash)

        if (!sucesso) {
            return res.status(404).json({
                msg: "Não foi possivel alterar senha"
            })
        }

        return res.status(200).json({
            msg: "Senha alterada com sucesso"
        })

    } catch (error) {

        console.error(error)
        return res.status(500).json({
            error: "Erro interno no servidor"
        })

    }
}

export const atualizarInformacoes = async (req, res) => {

    try {

        const userId = req.params.userId
        const { usuario, email, nome } = req.body

        if (!userId) {
            return res.status(400).json({
                msg: "ID do usuario não recebido"
            })
        }

        if (!req.body) {
            return res.status(400).json({
                msg: "body não recebido"
            })
        }

        if (!usuario) {
            return res.status(400).json({
                msg: "usuario não recebido"
            })
        }

        if (!email) {
            return res.status(400).json({
                msg: "email não recebido"
            })
        }

        if(!nome){
            return res.status(400).json({
                msg : "nome não recebido"
            })
        }

        const sucesso = await userRepository({
            userId,
            usuario,
            email,
            nome
        })

        if(!sucesso){
            return res.status(4040).json({
                msg : "Não foi possivel atualizar os dados do usuarios"
            })
        }

        return res.json(sucesso)

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: "Erro interno no servidor"
        })
    }
}
