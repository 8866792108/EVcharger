"use client"

import { useGoogleLogin } from "@react-oauth/google"
import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { googleAuth } from "./api"
import styled from "styled-components"
import Navbar from "./Navbar"

const LoginPage = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const [logininfo, setlogininfo] = useState({
    email: "",
    password: "",
  })

  // Response google signup
  const responseGoogle = async (authResult) => {
    try {
      console.log(authResult)
      if (authResult["code"]) {
        const result = await googleAuth(authResult["code"])

        console.log("The google login data :: ", result.data)
        const { email, name, _id, image, message } = result.data
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

  const handlechange = (e) => {
    const { name, value } = e.target
    const copylogininfo = { ...logininfo }
    copylogininfo[name] = value
    setlogininfo(copylogininfo)
    console.log(logininfo)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { email, password } = logininfo
    if (!email || !password) {
      return toast.error("Email or password are required", {
        position: "top-center",
        autoClose: 2000,
      })
    }

    try {
      const url = "http://localhost:8080/user/login"
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logininfo),
      })

      const result = await response.json()
      const { message, success, jwttoken, name, email, _id, error } = result
      console.log("The logged user data :: " + result)
      if (success) {
        toast.success(message, {
          position: "top-center",
          autoClose: 2000,
        })
        localStorage.setItem("email", result.email)
        localStorage.setItem("token", jwttoken)
        localStorage.setItem("name", name)
        localStorage.setItem("userId", _id)
        localStorage.removeItem("image")
        setTimeout(() => {
          navigate("/home")
        }, 1000)
      } else if (error) {
        const details = error?.details[0].message
        toast.error(details, {
          position: "top-center",
          autoClose: 2000,
        })
      } else if (!success) {
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
      <nav className="py-6 px-10 flex justify-between items-center border-b border-gray-800 z-[500]">
        <Navbar />
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4 md:p-10">
        <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row rounded-2xl overflow-hidden shadow-2xl">
          {/* Left Side - Image with Overlay */}
          <div className="w-full lg:w-1/2 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-black/50 z-10"></div>
            <div className="absolute inset-0 flex flex-col justify-center items-center z-20 p-10 text-center">
              <h2 className="text-4xl font-bold mb-4">Welcome to VOLTHUB</h2>
              <p className="text-lg mb-6">The future of electric mobility starts here</p>
              <FuturisticLine />
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full lg:w-1/2 bg-gray-900 p-8 md:p-12">
            <div className="max-w-md mx-auto">
              <h1 className="text-3xl font-bold mb-2">Login</h1>
              <p className="text-gray-400 mb-8">Access your VOLTHUB account</p>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <FuturisticInput
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    onChange={handlechange}
                    value={logininfo.email}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium">Password</label>
                    <button
                      type="button"
                      className="text-sm text-blue-400 hover:text-blue-300"
                      onClick={() => navigate("/forgot-password")}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <FuturisticInput
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      onChange={handlechange}
                      value={logininfo.password}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                            clipRule="evenodd"
                          />
                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <FuturisticButton type="submit">Login</FuturisticButton>
              </form>

              <div className="flex items-center my-8">
                <hr className="flex-grow border-t border-gray-700" />
                <span className="px-4 text-gray-500">Or continue with</span>
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
                Don't have an account?{" "}
                <button className="text-blue-400 hover:text-blue-300 font-medium" onClick={() => navigate("/signup")}>
                  Create Account
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

export default LoginPage

