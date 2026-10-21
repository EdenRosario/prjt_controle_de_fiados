import postgres from 'postgres'
import 'dotenv/config'

const sql = postgres(process.env.DATABASE_URL,{
    ssl: 'require'
})
console.log("conectou ao banco!")


export default sql


