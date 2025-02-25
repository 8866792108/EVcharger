const express = require("express");
const bodyparser = require("body-parser")
const cors = require("cors");
const Authroute = require("./Routes/Authroute");
const Evlocation = require("./Routes/Evlocation")
const Orderroute = require("./Routes/Orderroute")
const ProductRouter = require('./Routes/ProductRouter')

const { signupValidation } = require("./Middlewares/AuthValidate");
const { signup } = require("./Controllers/userController");
const upload = require("./Middlewares/upload");
const { setitems } = require("./Controllers/EvController");

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
// app.use(cors(corsOptions))
app.use(cors())
app.use(express.static("./public/images"))


app.use("/user", Authroute)
app.use("/products", ProductRouter)
app.use("/slots", Evlocation)
app.use("/orders",Orderroute)

app.get("/", (req, res) => {
    res.send("welcome users")
})

// app.post("/user/signup", upload.single("image"), signupValidation, signup)
app.post("/slots/setitems",upload.single("image"), setitems)


app.listen(PORT, () => {
    console.log(`Server is Started in  http://localhost:${PORT}`);

})