import express from 'express'
import cors from 'cors'
import 'dotenv/config'

//app Config
const app = express()
const port = process.env.PORT || 4000

//Middlewares
app.use(express.json())
app.use(cors())


//Api Endpoints

app.get('/',(req, res) =>{
    res.send('API WORKING')
})

app.listen(port,()=>{
  console.log("Server Start, port")
})



