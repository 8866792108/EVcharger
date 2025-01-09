const express = require("express");
const bodyparser = require("body-parser")
const cors = require("cors");
const Authroute = require("./Routes/Authroute");
const Evlocation = require("./Routes/Evlocation")
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
    origin: ["http://localhost:5173", "http://localhost", "http://127.0.0.1:5173"], // Allow Vite's dev server
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    credentials: true, // Allow cookies if needed
};

app.use(bodyparser.json())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions))
app.use(express.static("./public/images"))

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
app.use("/slots", Evlocation)

app.get("/", (req, res) => {
    res.send("welcome users")
})

app.post("/user/signup", upload.single("image"), signupValidation, signup)

app.listen(PORT, () => {
    console.log(`Server is Started in  http://localhost:${PORT}`);

})