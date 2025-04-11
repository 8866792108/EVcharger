const express = require("express");
const bodyparser = require("body-parser")
const cors = require("cors");
const Authroute = require("./Routes/Authroute");
const Evlocation = require("./Routes/Evlocation")
const Orderroute = require("./Routes/Orderroute")
const Msgroute = require("./Routes/Msgroute")
const JoinUsroute = require("./Routes/JoinUsroute")
const FeedbackRoute = require("./Routes/FeedbackRoute")

const { signupValidation } = require("./Middlewares/AuthValidate");
const { signup } = require("./Controllers/userController");
const upload = require("./Middlewares/upload");
const { setitems, updateitems } = require("./Controllers/EvController");
const ordermodel = require("./Models/order");
const userModel = require("./Models/user");
const slotmodel = require("./Models/slots");

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
app.use("/slots", Evlocation)
app.use("/orders", Orderroute)
app.use("/auth", Authroute)
app.use("/message", Msgroute)
app.use("/JoinWithUs", JoinUsroute)
app.use("/feedback", FeedbackRoute)
app.get("/TotalAll", async (req, res) => { 
    try {
        const totalusers = await userModel.countDocuments();
        const totalOrders = await ordermodel.countDocuments();
        const totalslots = await slotmodel.countDocuments();
        const activeorders = await ordermodel.find({ status: "Accepted" }).countDocuments();
        console.log(activeorders);

        const totalRevenueResult = await ordermodel.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: {
                            $convert: {
                                input: "$price",
                                to: "double",
                                onError: 0,
                                onNull: 0
                            }
                        }
                    }
                }
            }
        ]);

        const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].totalRevenue : 0;

        res.status(200).json({
            totalOrders,
            totalRevenue,
            totalusers,
            totalslots,
            activeorders
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching order stats", error });
    }
});


app.get("/", (req, res) => {
    res.send("welcome users")
})

// app.post("/user/signup", upload.single("image"), signupValidation, signup)
app.post("/slots/setitems/:id", upload.single("image"), updateitems)
app.post("/slots/setitems", upload.single("image"), setitems)


app.listen(PORT, () => {
    console.log(`Server is Started in  http://localhost:${PORT}`);

})