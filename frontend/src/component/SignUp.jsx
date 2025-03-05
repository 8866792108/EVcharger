"use client"

import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios"
import { useGoogleLogin } from "@react-oauth/google"
import { googleAuth } from "./api"
import styled from "styled-components"
import Navbar from "./Navbar"

const SignUp = () => {
  const [signupinfo, setsignupinfo] = useState({
    name: "",
    email: "",
    password: "",
    confirmpwd: "",
  })

  const navigate = useNavigate()

  // Response google signup
  const responseGoogle = async (authResult) => {
    try {
      console.log(authResult)
      if (authResult["code"]) {
        const result = await googleAuth(authResult["code"])

        const { email, name, image, _id, message } = result.data
        const token = result.data.token
        localStorage.setItem("email", email)
        localStorage.setItem("name", name)
        localStorage.setItem("token", token)
        localStorage.setItem("userId", _id)
        localStorage.setItem("image", image)
        toast.success(message, {
          position: "top-center",
          autoClose: 2000,
        })
        navigate("/home")
        console.log("result.data.user... ", result.data.user)
      }
    } catch (error) {
      console.log("Error while in google code :: " + error)
    }
  }

  // Login in google
  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  })

  // Save data
  const handlechange = (e) => {
    const { name, value } = e.target
    const copysignupinfo = { ...signupinfo }
    copysignupinfo[name] = value
    setsignupinfo(copysignupinfo)
    console.log(signupinfo)
  }

  // Signup in database for using api
  const handleSubmit = async (e) => {
    e.preventDefault()
    const { name, email, password, confirmpwd } = signupinfo

    if (password !== confirmpwd) {
      return toast.error("Both passwords do not match", {
        position: "top-center",
        autoClose: 2000,
      })
    }

    console.log("Your name is: ", signupinfo.name)
    const formdata = new FormData()
    formdata.append("name", name)
    formdata.append("email", email)
    formdata.append("password", password)

    console.log(formdata)

    try {
      const url = "http://localhost:8080/user/signup"

      const response = await axios.post(url, formdata, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("this is the response data::: " + response.data)
      const { message, success, error } = await response.data

      if (success) {
        toast.success(message, {
          position: "top-center",
          autoClose: 2000,
        })
        setTimeout(() => {
          navigate("/login")
        }, 1000)
      } else if (error) {
        console.log(error)
        const details = error?.details[0].message
        toast.error(details, {
          position: "top-center",
          autoClose: 2000,
        })
      } else {
        toast.error(message, {
          position: "top-center",
          autoClose: 2000,
        })
      }
    } catch (error) {
      toast.error(error, {
        position: "top-center",
        autoClose: 2000,
      })
    }
  }

  return (
    <div className="bg-black min-h-screen text-white flex flex-col">
      {/* Navbar */}
      <nav className="py-6 px-10 flex justify-between items-center border-b border-gray-800">
        <Navbar />
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4 md:p-10">
        <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-2xl">
          {/* Left Side - Image with Overlay */}
          <div className="w-full lg:w-1/2 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-black/50 z-10"></div>
            <img
              src="/placeholder.svg?height=800&width=600"
              alt="Electric Vehicle"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center z-20 p-10 text-center">
              <h2 className="text-4xl font-bold mb-4">Join VOLTHUB</h2>
              <p className="text-lg mb-6">Be part of the electric revolution</p>
              <FuturisticLine />
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <div className="w-full lg:w-1/2 bg-gray-900 p-8 md:p-12">
            <div className="max-w-md mx-auto">
              <h1 className="text-3xl font-bold mb-2">Create Account</h1>
              <p className="text-gray-400 mb-8">Join the future of electric mobility</p>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <FuturisticInput
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    onChange={handlechange}
                    value={signupinfo.name}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <FuturisticInput
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    onChange={handlechange}
                    value={signupinfo.email}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <FuturisticInput
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    onChange={handlechange}
                    value={signupinfo.password}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Confirm Password</label>
                  <FuturisticInput
                    type="password"
                    name="confirmpwd"
                    placeholder="Confirm your password"
                    onChange={handlechange}
                    value={signupinfo.confirmpwd}
                  />
                </div>

                <FuturisticButton type="submit">Create Account</FuturisticButton>
              </form>

              <div className="flex items-center my-8">
                <hr className="flex-grow border-t border-gray-700" />
                <span className="px-4 text-gray-500">Or sign up with</span>
                <hr className="flex-grow border-t border-gray-700" />
              </div>

              {/* Social Buttons */}
              <SocialButton onClick={googleLogin}>
                <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                </svg>
                Continue with Google
              </SocialButton>

              <p className="text-center mt-8 text-gray-400">
                Already have an account?{" "}
                <button className="text-blue-400 hover:text-blue-300 font-medium" onClick={() => navigate("/login")}>
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-10 border-t border-gray-800 text-center text-gray-500">
        <p>© 2024 VOLTHUB. All rights reserved.</p>
      </footer>

      <ToastContainer />
    </div>
  )
}

// Styled Components
const LogoText = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(90deg, #3b82f6, #22c55e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 1px;
`

const NavLinks = styled.a`
  color: #f3f4f6;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -4px;
    left: 0;
    background: linear-gradient(90deg, #3b82f6, #22c55e);
    transition: width 0.3s ease;
  }
  
  &:hover {
    color: #22c55e;
    
    &:after {
      width: 100%;
    }
  }
`

const NavButton = styled.button`
  padding: 0.5rem 1.25rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.2);
  }
`

const FuturisticInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: rgba(17, 24, 39, 0.8);
  border: 1px solid #374151;
  border-radius: 0.375rem;
  color: white;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
  }
  
  &::placeholder {
    color: #6b7280;
  }
`

const FuturisticButton = styled.button`
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(90deg, #3b82f6, #22c55e);
  border: none;
  border-radius: 0.375rem;
  color: white;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: all 0.6s ease;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
    
    &:before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(1px);
  }
`

const SocialButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  background-color: rgba(17, 24, 39, 0.8);
  border: 1px solid #374151;
  border-radius: 0.375rem;
  color: white;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(31, 41, 55, 0.8);
    border-color: #4b5563;
  }
`

const FuturisticLine = styled.div`
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #22c55e);
  border-radius: 2px;
  position: relative;
  
  &:before, &:after {
    content: '';
    position: absolute;
    height: 4px;
    width: 10px;
    background: #22c55e;
    border-radius: 2px;
  }
  
  &:before {
    left: -15px;
  }
  
  &:after {
    right: -15px;
  }
`

export default SignUp

