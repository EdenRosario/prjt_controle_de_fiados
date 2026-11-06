import { API_URL } from "../../config.js"

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

        const data = response.json();

        if (!response.ok) {
            throw new Error(
                data.message || data.error || "Erro ao redefinir senha do usuario."
            )
        }

        return data.id

    } catch (error) {
        console.error("Falha na autenticação do usuario",error)
        throw error
    }
}

export const criarUsuario = async (name, date, user, senha, email) => {

    try {

        if (!nome || !date || !user || !senha || !email) {
            throw new Error("Preencha todos os campos")
        }

        const response = await fetch(`${API_URL}/auth/register`, {

            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            name,
            date,
            user,
            senha,
            email
        })

        const data = response.json()

        if (!response.ok) {
            throw new Error(
                data.message || data.error || "Erro ao criar novo usuario."
            )
        }

    } catch (error) {
        console.error("Erro ao tentar criar usuario no sistema", error);
        throw error;
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

        const data = response.json()

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

export const auttentincarDados = async (user, senhaAntiga) =>{

    try{

        if(!user || !senhaAntiga){
            throw new Error("Preencha todos os campos")
        }

        const response = await fetch(``)

    }catch(error){

    }

}

export const mudarSenha = async () =>{

    

}