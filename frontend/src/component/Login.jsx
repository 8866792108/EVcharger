import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handleerror, handlesuccess } from "../assets/utility"

const Login = () => {
  const [logininfo, setlogininfo] = useState({
    email: '',
    password: ''
  })

  const Navigate = useNavigate()

  const hadlechange = (e) => {
    const { name, value } = e.target
    const copylogininfo = { ...logininfo }
    copylogininfo[name] = value
    setlogininfo(copylogininfo)
    console.log(logininfo)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = logininfo
    if (!email || !password) {
      return handleerror("email or password are required")
    }

    try {
      const url = "http://localhost:8080/user/login"
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(logininfo)
      })

      const result = await response.json()
      const { message, success, jwttoken, image, name, error } = result
      console.log(result)
      if (success) {
        handlesuccess(message)
        localStorage.setItem('user_email', email)
        localStorage.setItem('image', image)
        localStorage.setItem('token', jwttoken)
        localStorage.setItem('loggeduser', name)
        setTimeout(() => {
          Navigate('/home')
        }, 1000)
      } else if (error) {
        const details = error?.details[0].message
        handleerror(details)
      } else if (!success) {
        handleerror(message)
      }
      console.log(result);
    } catch (error) {
      handleerror(error)
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r text-black white from-purple-500 to-blue-500">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mb-4"></div>
          <h1 className="text-3xl font-bold text-purple-500 mb-6">Sign In</h1>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="mb-4 relative">
            <input
              type="text"
              placeholder="email"
              name="email"
              onChange={hadlechange}
              value={logininfo.email}
              className="w-full py-3 px-4 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Password Field */}
          <div className="mb-4 relative">
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={hadlechange}
              value={logininfo.password}
              className="w-full py-3 px-4 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />

          </div>

          <div className="flex justify-between items-center mb-4 text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" /> Remember me
            </label>
            <span className="text-purple-500 hover:underline cursor-pointer">
              Forgot password?
            </span>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-400 to-pink-500 text-white font-bold rounded-full hover:opacity-90 transition-all duration-300"
          >
            LOGIN
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-6 text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-purple-500 font-semibold hover:underline"
          >
            Sign up!
          </Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
