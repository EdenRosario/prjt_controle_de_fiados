import { DatabasePostgres } from "../database/users-repository.js";
import { tokensRopository } from "../database/tokens-recuperacao-repository.js";
import bcrypt from 'bcrypt'
import crypto from 'node:crypto';

const userRepository = new DatabasePostgres()
const tokensrepository = new tokensRopository()
const gerarToken = () => {

    return crypto.randomBytes(32).toString('hex');

};

const gerarHashToken = (token) => {

    return crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
};

const atualizarToken = async (token_hash, tokenId) => {
    //pendente
}

const reaproveitarToken = async (userId, finalidade) => {

    if (!userId) {
        console.log("Usuario não recebido")
        return false;
    }

    if (!finalidade) {
        console.log("finalidade não informada")
        return false;
    }

    try {
        const tokenpendente = await tokensrepository.buscarTokenPendentePorUsuario({
            userId,
            finalidade
        })

        if (!tokenpendente) {
            return "não há nenhum token pendente vinculado a este usuario ou não há token com a mesma finalidade requisitada", false;
        }

        return tokenpendente

    } catch (error) {
        console.error(error)
        return `Falaha ao verificar token pendente ${false}`;
    }

}

const manipularToken = async (usuarioId, finalidade) => {

    let token = ""
    let tokenHash = ""

    if (!usuarioId) {
        return false;
    }

    if (!finalidade) {
        return false;
    }

    token = gerarToken()

    if (!token) {
        return false;
    }

    tokenHash = gerarHashToken(token);

    if (!tokenHash) {
        return false;
    }

    try {



    } catch (error) {
        console.error(error)
        return `Falha ao gerar token ${false}`
    }

}

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
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                data: usuario.data_nascimento
            }
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: "Erro interno no servidor"
        })
    }
}

export const listarTodosUsuarios = async (req, res) => {

    try {

        const usuarios = await userRepository();

        if (!usuarios) {
            return res.status(404).json({
                msg: "Falha na busca dos usuarios"
            })
        }

        return res.status(200).json(usuarios)

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
        const { nome, email, nascimento } = req.body

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

        if (!nome) {
            return res.status(400).json({
                msg: "nome não recebido"
            })
        }

        if (!email) {
            return res.status(400).json({
                msg: "email não recebido"
            })
        }

        if (!nascimento) {
            return res.status(400).json({
                msg: "data não recebido"
            })
        }

        const sucesso = await userRepository.atualizarInformacoes({
            userId,
            nome,
            email,
            nascimento
        })

        if (!sucesso) {
            return res.status(404).json({
                msg: "Não foi possivel atualizar os dados do usuarios"
            })
        }

        return res.status(200).json({
            message: "Dados atualizados com sucesso"
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: "Erro interno no servidor"
        })
    }
}



export const recuperarUsuario = async (req, res) => {

    try {
        const finalidade = "recuperar_usuario"
        const { email } = req.body
        if (!email) {
            return res.status(400).json({
                message: "Email não recebido"
            })
        }

        const usuario = await userRepository.recuperarUsuario(email)

        if (!usuario) {
            return res.status(404).json({
                message: "Houve uma falha ao tentar buscar o usuario"
            })
        }

        const tokenPendente = reaproveitarToken(usuario.id, finalidade)

        if (!tokenPendente) {
            let token = manipularToken(usuario.id, finalidade)
        } else {

            let tokenParaReutilizar = reaproveitarToken()

            let novoToken = atualizarToken(
                tokenPendente.token_hash,
                tokenPendente.id
            )

        }

        manipularToken(usuario.id, finalidade)


        // return res.status(200).json({
        //     message: "email validado com sucesso",
        //     id : usuario.id
        // })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: "Erro interno no servidor"
        })
    }
}

export const testeToken = async (req, res) => {

    try {

        const id = Number(req.params.id);

        const { finalidade } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: 'ID do usuário inválido'
            });
        }

        if (!finalidade) {
            return res.status(400).json({
                message: 'Token ou finalidade não recebidos'
            });
        }



        // Gerar hash do token recebido
        const tokenHash = gerarHashToken(token);

        // Consultar token no banco
        const resultado = await tokensrepository.buscarToken({
            usuarioId: id,
            tokenHash,
            finalidade
        });

        if (!resultado) {
            return res.status(400).json({
                message: 'Token inválido, expirado ou já utilizado'
            });
        }

        return res.status(200).json({
            message: 'Token válido!',
            finalidade: resultado.finalidade
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: 'Erro interno no servidor'
        });
    }
};