const jwt = require("jsonwebtoken");
const userModel = require("../Models/user");
const bcrypt = require("bcrypt");

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if the user already exists
        const user = await userModel.findOne({ email });
        if (user) {
            return res.status(409).json({
                message: "User already exists",
                success: false,
            });
        }

        // Create a new user
        const newUser = new userModel({ name, email, password });
        newUser.password = await bcrypt.hash(password, 10);

        // Save the user to the database
        const result = await newUser.save();

        console.log(result)
        res.status(201).json({
            message: "Signup successful",
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error: " + error.message,
            success: false,
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(403)
                .json({ message: "Auth failed email or password is wrong", success: false })
        }

        const result = await bcrypt.compare(password, user.password)
        if (!result) {
            return res.status(403)
                .json({ message: "Auth failed email or password is wrong", success: false })
        }

        const jwttoken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_TOKEN,
            { expiresIn: '24h' }
        )


        res.status(201)
            .json({ message: "login successfully", success: true, jwttoken, email, name: user.name })


    } catch (error) {
        res.status(408)
            .json({ message: "Server error" + error, success: false })
    }
}




module.exports = {
    signup,
    login
}