const router = require("express").Router()
const ensureAntheticated = require('../Middlewares/Auth')

router.get("/",ensureAntheticated,(req,res)=>{
    console.log('login detail ',req.user);
    
    res.status(200).json([
        {
            name:"mobile",
            price:100000
        },
        {
            name:"laptop",
            price:5600000
        },
        {
            name:"AC",
            price:900000
        }
    ])
})


module.exports = router