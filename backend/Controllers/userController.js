const jwt = require("jsonwebtoken");
const userModel = require("../Models/user");
const bcrypt = require("bcrypt");
const { oauth2client } = require("../utils/googleConfig");
const axios = require('axios')

const signup = async (req, res) => {

    console.log("body: ", req.body)
    try {
        const { name, email, password } = req.body;
        console.log("Your request body is: ", req.body);

        // Check if the user already exists
        const user = await userModel.findOne({ email });
        if (user) {
            return res.status(200).json({
                message: "User already exists",
                success: false,
            });
        }

        // Create a new user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({
            name: name,
            email: email,
            password: hashedPassword
        });
        console.log("New users: ", newUser)

        // Save the user to the database
        await newUser.save()
        return res.status(201).json({
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
                .json({ message: "Auth failed user is not exist", success: false })
        }

        const result = await bcrypt.compare(password, user.password)
        if (!result) {
            return res.status(403)
                .json({ message: "Auth failed password is wrong", success: false })
        }

        const jwttoken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_TOKEN
        )


        res.status(201)
            .json({ message: "login successfully", success: true, jwttoken, email, name: user.name, _id: user._id })


    } catch (error) {
        res.status(408)
            .json({ message: "Server error" + error, success: false })
    }
}


const googlelogin = async (req, res) => {
    try {
        console.log("Received code:", req.query.code);

        if (!req.query.code) {
            return res.status(400).json({ success: false, message: "Authorization code is missing." });
        }

        const { code } = req.query;
        const { tokens } = await oauth2client.getToken(code);

        oauth2client.setCredentials(tokens);

        console.log("the tokens is the :: ", tokens.access_token)

        const userInfoRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`);
        console.log("Google Login Details:", userInfoRes.data);

        const { email, name, picture } = userInfoRes.data;
        let user = await userModel.findOne({ email });

        if (!user) {
            user = await userModel.create({ name, email, password: picture });
        }

        const token = jwt.sign({ _id: user._id, email }, process.env.JWT_TOKEN);

        return res.status(200).json({
            success: true,
            message: 'Login Successfully',
            token,
            email: user.email,
            name: user.name,
            image: user.password,
            _id: user._id
        });
    } catch (error) {
        console.error("Google Login Error:", error.response ? error.response.data : error.message);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
};

// const googlelogin = async (req, res) => {
//     try {
//         const { code } = req.query

//         const googleRes = await oauth2client.getToken(code)

//         // oauth2client.setCredentials(googleRes.tokens);

//         console.log(googleRes)
//         const UserRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`)

//         console.log("Google Login Details :: " + UserRes.data)
//         const { email, name, picture } = UserRes.data
//         let user = await userModel.findOne({ email })

//         if (!user) {
//             user = await userModel.create({
//                 name,
//                 email,
//                 password: picture
//             })
//         }

//         const { _id } = user
//         const token = jwt.sign({ _id, email }, process.env.JWT_TOKEN)

//         return res.status(200).json({
//             success: true,
//             message: 'Success',
//             token,
//             user
//         })
//     } catch (error) {
//         console.log("the error :: " , error)
//         return res.status(200).json({
//             success: false,
//             message: 'Internal Server Error'
//         })
//     }
// }


module.exports = {
    signup,
    login,
    googlelogin
}