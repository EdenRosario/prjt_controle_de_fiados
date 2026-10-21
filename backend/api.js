import express from  'express'
import cors from 'cors'
import 'dotenv/config'
//rotas
import userRoutes from './routes/users.routes.js'
import clientRouter from './routes/clients.routes.js'
import comprasRouter from './routes/compras.routes.js'
import itensComprasRouter from './routes/itens-compras.routes.js'
import produtosRouter from './routes/products.routes.js'
import pagamentosRouter from './routes/pagamentos.routes.js'

const PORT = process.env.PORT || 3000
const app = express()

app.use(cors({
    origin: ["http://localhost:5500", "http://127.0.0.1:5500"]
}))    

app.use(express.json())

app.use('/auth', userRoutes )

app.use('/clients', clientRouter )

app.use('/compras', comprasRouter)

app.use('/itensCompras', itensComprasRouter)

app.use('/produtos', produtosRouter)    

app.use('/pagamentos', pagamentosRouter)

app.use((err,req, res, next)=>{
    console.error(err)
    return res.status(500).json({
        error: "Erro interno no servidor"
    })
})

app.listen(PORT, ()=>{console.log("API rodando")})