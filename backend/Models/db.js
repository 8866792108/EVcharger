const mongoose = require("mongoose")

const mongo_url=process.env.MONGODB_CON

mongoose.connect(mongo_url)
    .then(()=>{
        console.log("mongodb connected successfully");
    })
    .catch((err)=>{
        console.log(`mongodb connection failed : ${err}`);
    })
 