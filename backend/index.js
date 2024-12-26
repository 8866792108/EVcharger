const express = require("express");
const bodyparser = require("body-parser")
const cors = require("cors");
const Authroute = require("./Routes/Authroute");
const ProductRouter = require('./Routes/ProductRouter')

require("dotenv").config()
require("./Models/db")

const app = express()

const PORT = process.env.PORT || 8080


app.use(bodyparser.json())
app.use(cors())


app.use("/user",Authroute)
app.use("/products",ProductRouter)

app.get("/",(req,res)=>{
    res.send("welcome users")
})


app.listen(PORT,()=>{
    console.log(`Server is Started in  http://localhost:${PORT}`);
    
})