import { API_URL } from "../../config.js"


export const criarUsuario = async (name, date, user, senha, email) => {

    try {

        if (!name || !date || !user || !senha || !email) {
            throw new Error("Preencha todos os campos")
        }

        const response = await fetch(`${API_URL}/auth/register`, {

            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                date,
                user,
                senha,
                email
            })
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(
                data.message || data.error || "Erro ao criar novo usuario."
            )
        }

        return data

    } catch (error) {
        console.error("Erro ao tentar criar usuario no sistema", error);
        throw error;
    }

}

export const validarDados = async (user, email, date) => {

    try {

        if (!user || !email || !date) {
            throw new Erro("Preencha todos os campos")
        }

        const response = await fetch(`${API_URL}/auth/recover`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user,
                email,
                date
            })
        })

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || data.error || "Erro ao validar dados."
            )
        }

        return data.id

    } catch (error) {
        console.error("Falha na validação de dados do usuario", error)
        throw error
    }
}

export const recuperarSenha = async (newSenha, idUser) => {

    try {

        if (!newSenha) {

            throw new Error("Preencha o campo senha")

        }

        if (!idUser) {

            throw new Error("Id do usuario não informado")

        }

        const response = await fetch($`${API_URL}/auth/${idUser}`, {

            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                newSenha,
            })

        });

        const data = await response.json()

        if (!response.ok) {

            throw new Error(
                data.msg || data.error || "Erro ao redefinir senha do usuario."
            )

        }

    } catch (error) {
        console.error("Erro ao tentar redefinir senha", error);
        throw error;
    }

}

export const autentincarDados = async (user, senhaAntiga) => {

    try {

        if (!user || !senhaAntiga) {
            throw new Error("Preencha todos os campos")
        };

        const response = await fetch(`http://localhost:3000/auth/autenticar`, {

            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user,
                senhaAntiga
            })

        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.msg || data.error || "Erro ao autenticar dados do usuario."
            )
        };

        return data;

    } catch (error) {
        console.error("Erro ao tentar autenticar dados", error);
        throw error;
    };
};

//mudar senha pode ser reutilizada no modal de listagem dos usuarios

export const mudarSenha = async (id, novaSenha) => {

    try {

        if (!id || !novaSenha) {
            throw new Error("Preencha todos os campos")
        };

        const response = await fetch(`http://localhost:3000/users/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                novaSenha
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.msg || data.error || "Erro ao tentar mudar senha."
            )
        };

        return data;

    } catch (error) {
        console.error("Erro ao tentar mudar senha do usuario", error);
        throw error;
    }

}

export const atualizarInformacoes = async (userId, usuario, email, nome) => {

    try {

        if (!userId) {
            throw new Error("ID do usuario não informado")
        }

        if (!usuario || !email || !nome) {
            throw new Error("Preencha todos campos")
        }

        const response = await fetch(`http://localhost:3000/users/atualizar/${userId}`, {

            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuario,
                email,
                nome
            })

        })

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.msg || data.error || "Erro ao atualizar informações."
            )
        };

        return data;

    } catch (error) {
        console.error("Falha ao tentar atualizar informações", error)
        throw error;
    };

}

export const listarUsuarios = async () => {

    try {

        const response = await fetch(`http://localhost:3000/users`, { method: "GET" })

        const usuarios = await response.json();

        if (!response.ok) {
            throw new Error(
                usuarios.msg || usuarios.error || "Erro ao tentar listar usuarios."
            )
        }

        return usuarios;

    } catch (error) {
        console.error("Erro ao tentar listar usuarios", error)
        throw error
    }

}

export const autenticarUsuarioModalListagem = async (idUser, nome) => {

    try {

        if (!idUser || !nome) {
            throw new Error("ID e nome do usuario não informados")
        }

        const response = await fetch(``)

    } catch (error) {
        console.error("Falha na autenticação do usuario", error)
        throw error

    }

}