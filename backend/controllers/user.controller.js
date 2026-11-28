import { DatabasePostgres } from "../database/users-repository.js";
import { tokensRopository } from "../database/tokens-recuperacao-repository.js";
import { codigosRecuperacao } from "../database/codigos_recueperacao-repository.js";
import dotenv from "dotenv";
dotenv.config();
import bcrypt from 'bcrypt'
import crypto from 'node:crypto';
import { readFile } from "node:fs/promises";
import path from "node:path";
import { Resend } from "resend";


const resend = new Resend(process.env.RESEND_API_KEY);

const userRepository = new DatabasePostgres();
const tokensrepository = new tokensRopository();
const codigoRecuperacaoRepository = new codigosRecuperacao();

const enviarEmail = async (endereco, assunto, mensagem) => {

    const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_CADASTRADO,
        to: endereco,
        subject: assunto,
        html: mensagem
    })
    if (error) {
        throw new Error(error.message);
    }

    return data;
};

const montarEmailRecuperarUsuario = async (nome, linkVerificacao) => {

    const caminhoArquivo = path.join(
        process.cwd(),
        "templates",
        "email",
        "recuperarUsuario.html"
    );

    let html = await readFile(caminhoArquivo, "utf-8");

    html = html
        .replaceAll("{{nome}}", escaparHtml(nome))
        .replaceAll("{{linkVerificacao}}", escaparHtml(linkVerificacao));

    return html;
};

const montarEmailRecuperarSenha = async (nome, linkVerificacao) => {

    const caminhoArquivo = path.join(
        process.cwd(),
        "templates",
        "email",
        "recuperarSenha.html"
    );

    let html = await readFile(caminhoArquivo, "utf-8");

    html = html
        .replaceAll("{{nome}}", escaparHtml(nome))
        .replaceAll("{{linkVerificacao}}", escaparHtml(linkVerificacao));

    return html;
};

const escaparHtml = (valor) => {

    return String(valor ?? "").replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[caractere]);

};


const gerarCodigoRecuperacao = () => {

    return crypto.randomInt(0, 1000000)
        .toString()
        .padStart(6, "0");
};

const gerarHashCodigo = (codigo) => {
    return crypto
        .createHash("sha256")
        .update(codigo)
        .digest("hex");
};

const gerarToken = () => {

    return crypto.randomBytes(32).toString('hex');

};

const gerarHashToken = (token) => {

    return crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
};

const atualizarToken = async (token, tokenNovoHash, tokenPendenteId, finalidade) => {


    if (!token || !tokenNovoHash || !tokenPendenteId || !finalidade) {
        console.log("[TOKEN] Parâmetros inválidos para atualização");
        return false;
    }

    const finalidadesPermitidas = [
        "recuperar_usuario",
        "recuperar_senha",
        "editar_dados"
    ];

    if (!finalidadesPermitidas.includes(finalidade)) {
        return false;
    };



    try {
        const tokenAtualizado = await tokensrepository.atualizarToken({
            tokenNovoHash,
            tokenPendenteId,
            finalidade
        });

        if (!tokenAtualizado) {
            return false;
        }

        return {
            token,
            registro: tokenAtualizado
        }

    } catch (error) {
        console.error("[TOKEN] Falha ao atualizar token", error)
        return false;
    }
}

const reaproveitarToken = async (userId, finalidade) => {

    if (!userId) {

        return false;
    }

    if (!finalidade) {

        return false;
    }

    try {
        const tokenPendente = await tokensrepository.buscarTokenPendentePorUsuario({
            userId,
            finalidade
        });

        if (!tokenPendente) {
            return false;
        }

        return tokenPendente;

    } catch (error) {
        console.error("[TOKEN] Falha ao verificar token pendente:", error);
        return false;
    }

}

const criarSalvarToken = async (usuarioId, finalidade) => {

    let token = ""
    let tokenHash = ""

    const finalidadesPermitidas = [
        "recuperar_usuario",
        "recuperar_senha",
        "editar_dados"
    ];

    if (!usuarioId) {
        return false;
    }

    if (!finalidade) {
        return false;
    }

    if (!finalidadesPermitidas.includes(finalidade)) {
        console.log("[TOKEN] Finalidade inválida:", finalidade);
        return false;
    }

    token = gerarToken();

    if (!token) {
        console.log("[TOKEN] Falha ao gerar token");
        return false;
    }

    tokenHash = gerarHashToken(token);

    if (!tokenHash) {
        console.log("[TOKEN] Falha ao gerar hash");
        return false;
    }

    try {

        const tokenSalvo = await tokensrepository.criarNovoToken({
            usuarioId,
            tokenHash,
            finalidade
        })

        if (!tokenSalvo) {

            return false;
        }
        return {
            token,
            registro: tokenSalvo
        }

    } catch (error) {
        console.error("[TOKEN] Falha ao salvar token:", error);
        return false;
    }
}


const criarSalvarHashCodigoRecuperacao = async (codigoOriginal, hashCodigoRecuperacao, usuarioId) => {

    try {

        if (!hashCodigoRecuperacao) {
            return false;
        }

        const codigo = await codigoRecuperacaoRepository.salvarCodigoRecuperacao(
            hashCodigoRecuperacao,
            usuarioId
        )

        if (!codigo) {
            return false;
        }

        return {
            codigoOriginal,
            registro: codigo
        }

    } catch (error) {
        console.error("[CODIGO] Falha ao salvar codigo:", error)
        return false;
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

        const { email } = req.body;
        const finalidade = "recuperar_usuario";

        let novoToken = "";
        let tokenHash = "";
        let tokenParaEnviar = "";

        if (!email) {

            return res.status(400).json({
                message: "Email não recebido"
            });
        }

        const usuario = await userRepository.recuperarUsuario(email);

        if (!usuario) {

            return res.status(404).json({
                message: "Houve uma falha ao tentar buscar o usuario"
            });
        }


        const tokenPendente = await reaproveitarToken(
            usuario.id,
            finalidade
        );

        if (!tokenPendente) {

            const resultado = await criarSalvarToken(
                usuario.id,
                finalidade
            );

            if (!resultado?.token) {
                return res.status(500).json({
                    message: "Falha ao gerar token"
                });
            }

            tokenParaEnviar = resultado.token;

        } else {

            novoToken = gerarToken();
            tokenHash = gerarHashToken(novoToken);

            const resultado = await atualizarToken({

                tokenNovoHash: tokenHash,
                tokenPendenteId: tokenPendente.id,
                finalidade

            });

            if (!resultado?.token) {

                return res.status(500).json({
                    message: "Falha ao atualizar token"
                });
            }

            tokenParaEnviar = novoToken;
        }


        if (!process.env.FRONTEND_URL) {
            throw new Error("FRONTEND_URL não definida no ambiente do Render");
        }

        const linkVerificacao = `${process.env.FRONTEND_URL}?token=${encodeURIComponent(tokenParaEnviar)}`;

        const html = await montarEmailRecuperarUsuario(
            usuario.nome,
            linkVerificacao
        );

        await enviarEmail(
            usuario.email,
            "Recuperação de usuário | CFGestão",
            html
        );

        return res.status(200).json({
            message: "Se o e-mail estiver cadastrado, você receberá as instruções de recuperação."
        });

    } catch (error) {
        console.error("[RECUPERAR] Erro completo:", error);
        return res.status(500).json({
            error: "Erro interno no servidor"
        });
    }
};


export const confirmarRecuperarUsuario = async (req, res) => {

    try {

        const { token } = req.body
        const finalidade = "recuperar_usuario"

        if (!token) {
            return res.status(400).json({
                message: "Token não recebido"
            })
        }

        const tokenHash = gerarHashToken(token)

        if (!tokenHash) {
            return res.status(400).json({
                message: "Não foi possivel gerar hash para o token"
            })
        }

        const tokenValido = await tokensrepository.buscarTokenValido({
            tokenHash,
            finalidade
        })

        if (!tokenValido) {
            return res.status(404).json({
                message: "Token invalidado ou já utilizado"
            })
        }
        const tokenHashValido = tokenValido.token_hash
        const usuarioId = tokenValido.usuario_id

        const tokenConsumido = await tokensrepository.marcarTokenUtilizado({
            tokenHashValido,
            usuarioId,
            finalidade
        })


        if (!tokenConsumido) {
            return res.status(500).json({
                message: "Não foi possível concluir a recuperação do usuário."
            });

        }

        console.log(`[TOKEN] Token consumido ${tokenConsumido}`)

        return res.status(200).json({
            usuario: tokenValido.usuario
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: "Erro interno no servidor"
        })
    }
}
//funcionando
export const solicitarCodigoRecuperacaoSenha = async (req, res) => {

    try {

        let codigoRecuperacaoParaEnviar = "";

        const { parametro } = req.body;

        if (!parametro) {
            return res.status(400).json({
                message: "parametro de busca não recebido"
            });
        };

        const usuario = await userRepository.buscarUsuarioRecuperarSenha(parametro);

        if (!usuario) {
            return res.status(404).json({
                message: "usuario não encontrado"
            });
        };

        const codigoRecuperacaoPendente = await codigoRecuperacaoRepository.buscarCodigoRecuperacaoNaoUtilizado(usuario.id)

        if (!codigoRecuperacaoPendente) {

            const codigoRecuperacao = gerarCodigoRecuperacao();
            const hashCodigoRecuperacao = gerarHashCodigo(codigoRecuperacao);

            const registroCodigoRecuperacaoSalvo = await criarSalvarHashCodigoRecuperacao(
                codigoRecuperacao,
                hashCodigoRecuperacao,
                usuario.id
            )

            if (!registroCodigoRecuperacaoSalvo) {
                return res.status(500).json({
                    message: "Falha ao gerar codigo"
                })
            }
            codigoRecuperacaoParaEnviar = registroCodigoRecuperacaoSalvo.codigoOriginal;

        } else {

            const codigoRecuperacao = gerarCodigoRecuperacao();
            const hashCodigoRecuperacao = gerarHashCodigo(codigoRecuperacao);

            const codigoAtualizado = await codigoRecuperacaoRepository.atualizarCodigoRecuperacaoNaoUtilizado(
                hashCodigoRecuperacao,
                codigoRecuperacaoPendente.id
            )

            if (!codigoAtualizado) {
                return res.status(500).json({
                    message: "não foi possivel atualizar codigo pendente"
                })
            }

            codigoRecuperacaoParaEnviar = codigoRecuperacao;
        }

        return res.status(200).json({
            message: "Se os dados corresponderem a uma conta, enviaremos um código de recuperação para o e-mail cadastrado.",
            codigo : codigoRecuperacaoParaEnviar
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Erro interno no servidor"
        });
    };

};


export const recuperarSenha = async (req, res) => {

    try {

        const {codigoRecuperacao, email} = req.body

        if(!codigoRecuperacao || !email){
            return res.status(400).json({
                message: "codigo ou email não recebidos"
            })
        }

        const hashCodigoRecuperacao = gerarHashCodigo(codigoRecuperacao);
        
       const registro = await codigoRecuperacaoRepository.buscarCodigoRecuperacaoNaoUtilizado(hashCodigoRecuperacao) 

        let tokenParaEnviar = "";

        
        const usuario = await userRepository.recSenha(parametro)

        if (!usuario) {
            return res.status(404).json({
                message: "usuario não encontrado em nossa base de dados"
            })
        };

        console.log(
            usuario.id,
            usuario.email
        )





        const tokenPendente = await reaproveitarToken(
            usuario.id,
            finalidade
        )

        if (!tokenPendente) {

            const resultado = await criarSalvarToken(
                usuario.id,
                finalidade
            )

            if (!resultado?.token) {
                return res.status(500).json({
                    message: "Falha ao gerar token"
                })
            }

            tokenParaEnviar = resultado.token
        } else {

            novoToken = gerarToken();
            tokenHash = gerarHashToken(novoToken)

            const resultado = await atualizarToken({
                tokenNovoHash: tokenHash,
                tokenPendenteId: tokenPendente.id,
                finalidade
            });

            if (!resultado) {
                return res.status(500).json({
                    message: "Falha ao atualizar token"
                });
            };
            tokenParaEnviar = resultado.token
        };

        if (!process.env.PAGINA_REC_SENHA_URL) {
            throw new Error("FRONTEND_URL não definida no ambiente do Render")
        }

        const linkVerificacao = `${process.env.PAGINA_REC_SENHA_URL}?token=${encodeURIComponent(tokenParaEnviar)}`;

        const html = await montarEmailRecuperarSenha(
            usuario.nome,
            linkVerificacao
        );

        await enviarEmail(
            usuario.email,
            "Recuperação de senha | CFGestão",
            html
        )

        return res.status(200).json({
            message: "Se o e-mail estiver cadastrado, você receberá as instruções de recuperação."
        })

    } catch (error) {
        console.error("[RECUPERAR SENHA] Erro completo: ", error)
        return res.status(500).json({
            message: "Erro interno no servidor"
        })
    }
}
