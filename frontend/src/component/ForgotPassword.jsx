"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import styled from "styled-components"
import Navbar from "./Navbar"
import axios from "axios"

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showOtpField, setShowOtpField] = useState(false)
  const [isOtpVerified, setIsOtpVerified] = useState(false)

  const [datainfo, setdatainfo] = useState({
    email: "",
    otp: "",
    password: "",
    confirmpwd: "",
  })

  const handlechange = (e) => {
    const { name, value } = e.target
    const copydatainfo = { ...datainfo }
    copydatainfo[name] = value
    setdatainfo(copydatainfo)
    console.log(datainfo)
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!datainfo.email) {
      return toast.error("Email is required", {
        position: "top-center",
        autoClose: 2000,
      })
    }

    setIsSubmitting(true)
    try {
      const url = "http://localhost:8080/user/forgot-password"
      // const response = await fetch(url, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ email }),
      // })

      const response = await axios.post(url, {
        "email": datainfo.email
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      })

      console.log(response.data)

      const result = await response.data
      if (result.success) {
        toast.success(result.message || "OTP sent to your email", {
          position: "top-center",
          autoClose: 2000,
        })
        setShowOtpField(true)
      } else {
        toast.error(result.message || "Failed to process request", {
          position: "top-center",
          autoClose: 2000,
        })
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.", {
        position: "top-center",
        autoClose: 2000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!datainfo.otp) {
      return toast.error("Please enter OTP", {
        position: "top-center",
        autoClose: 2000,
      })
    }

    try {
      const { email, otp } = datainfo
      const url = "http://localhost:8080/user/verify-otp"
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      })

      const result = await response.json()
      if (result.success) {
        toast.success(result.message, {
          position: "top-center",
          autoClose: 2000,
        })
        setIsOtpVerified(true)
      } else {
        toast.error(result.message || "Invalid OTP", {
          position: "top-center",
          autoClose: 2000,
        })
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.", {
        position: "top-center",
        autoClose: 2000,
      })
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (!datainfo.password || !datainfo.confirmpwd) {
      return toast.error("Please fill in all fields", {
        position: "top-center",
        autoClose: 2000,
      })
    }

    if (datainfo.password !== datainfo.confirmpwd) {
      return toast.error("Both Passwords do not match", {
        position: "top-center",
        autoClose: 2000,
      })
    }

    try {
      const { email, password } = datainfo
      const url = "http://localhost:8080/user/reset-password"
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const result = await response.json()
      if (result.success) {
        toast.success("Password reset successfully!", {
          position: "top-center",
          autoClose: 2000,
        })
        setTimeout(() => {
          navigate("/login")
        }, 2000)
      } else {
        toast.error(result.message || "Failed to reset password", {
          position: "top-center",
          autoClose: 2000,
        })
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.", {
        position: "top-center",
        autoClose: 2000,
      })
    }
  }

  return (
    <div className="bg-black min-h-screen text-white flex flex-col">
      {/* Navbar */}
      {/* <nav className="py-6 px-10 flex justify-between items-center border-b border-gray-800">
        <Navbar />
      </nav> */}

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
              <h2 className="text-4xl font-bold mb-4">Reset Password</h2>
              <p className="text-lg mb-6">We'll help you get back on track</p>
              <FuturisticLine />
            </div>
          </div>

          {/* Right Side - Reset Password Form */}
          <div className="w-full lg:w-1/2 bg-gray-900 p-8 md:p-12">
            <div className="max-w-md mx-auto">
              <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
              <p className="text-gray-400 mb-8">
                {!showOtpField
                  ? "Enter your email address to receive a verification code"
                  : !isOtpVerified
                    ? "Enter the verification code sent to your email"
                    : "Create your new password"
                }
              </p>

              {!showOtpField ? (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <FuturisticInput
                      type="email"
                      placeholder="Enter your email"
                      name="email"
                      value={datainfo.email}
                      onChange={handlechange}
                      disabled={isSubmitting}
                    />
                  </div>

                  <FuturisticButton type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Sending Code..." : "Send Verification Code"}
                  </FuturisticButton>
                </form>

              ) : showOtpField && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Verification Code</label>
                    <div className="flex gap-4">
                      <FuturisticInput
                        type="text"
                        placeholder="Enter verification code"
                        value={datainfo.otp}
                        name="otp"
                        disabled={isOtpVerified}
                        onChange={handlechange}
                        className="flex-grow"
                      />
                      <FuturisticButton
                        type="button"
                        onClick={handleVerifyOtp}
                        className="!w-auto whitespace-nowrap"
                      >
                        Verify
                      </FuturisticButton>
                    </div>
                  </div>
                  <form className="space-y-6" onSubmit={handleResetPassword}>
                    <div>
                      <label className="block text-sm font-medium mb-2">New Password</label>
                      <FuturisticInput
                        type="password"
                        placeholder="Enter new password"
                        name="password"
                        value={datainfo.password}
                        disabled={!isOtpVerified}
                        onChange={handlechange}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Confirm Password</label>
                      <FuturisticInput
                        type="password"
                        placeholder="Confirm new password"
                        name="confirmpwd"
                        value={datainfo.confirmpwd}
                        disabled={!isOtpVerified}
                        onChange={handlechange}
                      />
                    </div>

                    <FuturisticButton type="submit" disabled={!isOtpVerified}>
                      Reset Password
                    </FuturisticButton>
                  </form>
                </div>
              )}

              <div className="text-center mt-6">
                <button
                  type="button"
                  className="text-blue-400 hover:text-blue-300 font-medium"
                  onClick={() => navigate("/login")}
                >
                  Back to Login
                </button>
              </div>
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

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
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
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
    
    &:before {
      left: 100%;
    }
  }
  
  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
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

export default ForgotPassword