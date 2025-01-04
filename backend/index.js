const express = require("express");
const bodyparser = require("body-parser")
const cors = require("cors");
const Authroute = require("./Routes/Authroute");
const ProductRouter = require('./Routes/ProductRouter')
const multer = require("multer")
const path = require("path");
const { signupValidation } = require("./Middlewares/AuthValidate");
const { signup } = require("./Controllers/userController");

require("dotenv").config()
require("./Models/db")

const app = express()

const PORT = process.env.PORT || 8080
const corsOptions = {
    origin: ["http://localhost:5173","http://localhost","http://127.0.0.1:5173"], // Allow Vite's dev server
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    credentials: true, // Allow cookies if needed
  };

app.use(bodyparser.json())
app.use(cors(corsOptions))
app.use(express.static("./public/image"))

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })

app.use("/user", Authroute)
app.use("/products", ProductRouter)

app.get("/", (req, res) => {
    res.send("welcome users")
})

app.post("/user/signup",signupValidation, upload.single("image"), signup)

app.listen(PORT, () => {
    console.log(`Server is Started in  http://localhost:${PORT}`);

})