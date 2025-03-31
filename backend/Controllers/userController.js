const jwt = require("jsonwebtoken");
const userModel = require("../Models/user");
const bcrypt = require("bcrypt");
const { oauth2client } = require("../utils/googleConfig");
const axios = require('axios');
const feedbackmodel = require("../Models/feedback");
const otpModel = require("../Models/otp");
const { SendVerificationCode } = require("../Middlewares/EmailConfige");
const messagemodel = require("../Models/message");

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

        // Ensure JWT secret is defined
        if (!process.env.JWT_TOKEN) {
            throw new Error("Missing JWT_SECRET in environment variables");
        }

        // Admin Login
        if (process.env.ADMIN_EMAIL === email && process.env.ADMIN_PASSWORD === password) {
            const jwttoken = jwt.sign(
                { email: process.env.ADMIN_EMAIL, name: "VoltHub Sanjay" },
                process.env.JWT_TOKEN,
                { expiresIn: "1h" }
            );

            return res.status(200).json({
                message: "Login successful",
                Admin: true,
                jwttoken,
                email: process.env.ADMIN_EMAIL,
                name: "VoltHub Sanjay",
                AdminUrl: process.env.ADMIN_URL
            });
        }

        // User Login
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(403).json({
                message: "Authentication failed: User does not exist",
                success: false
            });
        }

        const result = await bcrypt.compare(password, user.password);
        if (!result) {
            return res.status(403).json({
                message: "Authentication failed: Incorrect password",
                success: false
            });
        }

        // Generate User JWT Token
        const jwttoken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_TOKEN,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: "Login successful",
            success: true,
            jwttoken,
            email: user.email,
            name: user.name,
            _id: user._id
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            success: false
        });
    }
};

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
            user = await userModel.create({ name, email });
        }

        const token = jwt.sign({ _id: user._id, email }, process.env.JWT_TOKEN);

        return res.status(200).json({
            success: true,
            message: 'Login Successfully',
            token,
            email: user.email,
            name: user.name,
            image: picture,
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

const ForgetPassword = async (req, res) => {
    try {
        const { email } = req.body

        const user = await userModel.findOne({ email: email });
        if (!user) {
            return res.status(200).json({
                message: "User not found",
                success: false,
            });
        }

        // SendVerificationCode("sanjaychilgani119@gmail.com", Math.floor((Math.random() * 1000000) + 1))
        const randomotp = Math.floor((Math.random() * 1000000) + 1)
        const newotp = new otpModel({
            email: email,
            otp: randomotp
        })
        await newotp.save()

        SendVerificationCode(email, randomotp)

        return res.status(200).json({
            message: "OTP verified successfully!",
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error: " + error.message,
            success: false,
        });
    }
}

const VerifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Find OTP in the database
        const result = await otpModel.findOne({ email, otp });

        // If no matching OTP is found
        if (!result) {
            return res.status(400).json({
                message: "Invalid OTP or OTP not found",
                success: false,
            });
        }

        // Ensure `expiresAt` exists and check expiration
        if (result.expiresAt && result.expiresAt < new Date()) {
            // await otpModel.deleteOne({ _id: result._id }); 
            return res.status(400).json({
                message: "OTP expired. Please request a new one.",
                success: false,
            });
        }

        // Mark OTP as verified
        result.isVerified = true;
        await result.save();

        return res.status(200).json({
            message: "OTP Verified Successfully",
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error: " + error.message,
            success: false,
        });
    }
};



const updatePassword = async (req, res) => {
    console.log("body: ", req.body);
    try {
        const { email, password } = req.body;
        console.log("Your request body is: ", req.body);

        // Check if the user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user's password
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            message: "Password reset successfully!",
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error: " + error.message,
            success: false,
        });
    }
};



module.exports = {
    signup,
    login,
    googlelogin,
    ForgetPassword,
    VerifyOTP,
    updatePassword
}