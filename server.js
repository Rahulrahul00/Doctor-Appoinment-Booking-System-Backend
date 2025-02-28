import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import { doctorList } from './controllers/doctorController.js'
import userRouter from './routes/userRoute.js'

//app Config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()
//Middlewares
app.use(express.json())
app.use(cors())


//Api Endpoints
app.use('/api/admin' ,adminRouter)  // localhost:4000/api/admin/add-doctor
app.use('/api/doctor', doctorList) //localhost:4000/api/doctor/list
app.use('/api/user', userRouter)




app.get('/',(req, res) =>{
    res.send('API WORKING good condition')
})

app.listen(port, ()=>{
  console.log("Server Stared",port)
})


