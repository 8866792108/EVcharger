const jwt = require("jsonwebtoken");
const userModel = require("../Models/user");
const bcrypt = require("bcrypt");

const signup = async (req, res) => {
    console.log("file: ", req.file)
    console.log("body: ", req.body)
    try {
        const { name, email, password } = req.body;
        console.log("Your request body is: ", req.body);
        if (!req.file || !req.file.filename) {
            return res.status(400).json({
                message: "Image upload is required",
                success: false,
            });
        }

        const { filename } = req.file;

        // Check if the user already exists
        const user = await userModel.findOne({ email });
        if (user) {
            return res.status(409).json({
                message: "User already exists",
                success: false,
            });
        }

        // Create a new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({
            image: filename,
            name: name,
            email: email,
            password: hashedPassword
        });
        console.log("New users: ",newUser)
        // Save the user to the database
        await newUser.save()
        return res.status(201).json({
            message: "Signup successful",
            success: true,
        });
        // console.log(result)
        // res.status(201).json({
        //     message: "Signup successful",
        //     success: true,
        // });
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