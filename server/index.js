const express = require ('express')
const mongoose = require ('mongoose')
const cors = require ('cors')
const dotenv = require ('dotenv')
dotenv.config()
const logRoutes = require ('./routes/logRoutes')


const app = express()
app.use(cors())
app.use(express.json())


mongoose.connect(process.env.MONGODB_URI)
  .then(()=>console.log('mongodb connected'))
  .catch((err)=>console.error('mongodb connection error',err))

app.use('/log', logRoutes)

  app.listen(3000,()=>{
    console.log("port 3000 is connected");
    
})