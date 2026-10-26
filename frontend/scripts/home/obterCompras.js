export async function getHistoricoComprasDetalhadoPorData(clienteId) {

    if (!clienteId) {
        throw new Error("nenhum cliente encontrado");
    }else{


        try{
    
            const response = await fetch(`http://localhost:3000/itensCompras/compraDetalhada/8`);
        
            const data = await response.json();
        
            
            
             if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.error ||
                    "Não foi possível adicionar o produto à compra.",
                );
            }

            console.log("dados obtidos",data);

            return data;     
            
        }catch(error){

            console.error("Erro ao adicionar item à compra:", error);
            throw error;

        }

    }


}
