import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handleerror, handlesuccess } from "../assets/utility"
const SignUp = () => {

  const [signupinfo, setsignupinfo] = useState({
    name: '',
    email: '',
    password: ''
  })

  const Navigate = useNavigate()

  const hadlechange = (e) => {
    const { name, value } = e.target
    const copysignupinfo = { ...signupinfo }
    copysignupinfo[name] = value
    setsignupinfo(copysignupinfo)
    console.log(signupinfo)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupinfo
    if (!name || !email || !password) {
      return handleerror("name or email or password are required")
    }

    try {
      const url = "http://localhost:8080/user/signup"
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signupinfo)
      })

      const result = await response.json()
      const { message, success,error } = result
      if (success) {
        handlesuccess(message)
        setTimeout(()=>{
          Navigate('/login')
        },1000)
      }else if(error){
        const details= error?.details[0].message
        handleerror(details)
      }else if(!success){
        handleerror(message)
      }
      console.log(result);

    } catch (error) {
      handleerror(error)
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-pink-500">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-pink-400 to-blue-400 mx-auto mb-4"></div>
          <h1 className="text-3xl font-bold text-blue-500 mb-6">Sign Up</h1>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="mb-4">
            <input
              type="text"
              name="name"
              onChange={hadlechange}
              value={signupinfo.name}
              placeholder="Username"
              autoFocus
              className="w-full py-3 px-4 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <input
              type="text"
              name="email"
              onChange={hadlechange}
              placeholder="Email"
              value={signupinfo.email}
              className="w-full py-3 px-4 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <input
              type="password"
              name="password"
              onChange={hadlechange}
              placeholder="Password"
              value={signupinfo.password}
              className="w-full py-3 px-4 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-blue-400 text-white font-bold rounded-full hover:opacity-90 transition-all duration-300"
          >
            SIGN UP
          </button>
        </form>

        {/* Back to Sign In */}
        <div className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-blue-500 font-semibold hover:underline"
          >
            Sign in!
          </Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
