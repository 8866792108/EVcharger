import { useGoogleLogin } from "@react-oauth/google";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { googleAuth } from "./api";


const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);


  const [logininfo, setlogininfo] = useState({
    email: '',
    password: ''
  })

  const Navigate = useNavigate()

  //response google signup
  const responseGoogle = async (authResult) => {
    try {
      console.log(authResult)
      if (authResult['code']) {
        const result = await googleAuth(authResult['code'])

        console.log("The google login data :: ", result.data)
        const { email, name, _id, image, message } = result.data;
        const token = result.data.token
        localStorage.setItem("email", email)
        localStorage.setItem("name", name)
        localStorage.setItem("token", token)
        localStorage.setItem("userId", _id)
        localStorage.setItem("image", image)
        toast.success(message, {
          position: "top-center",
          autoClose: 2000
        })
        Navigate('/home')
        console.log("result.data.user... ", result.data.user)
      }
    } catch (error) {
      console.log("Error while in google code :: " + error)
    }
  }

  // login  in google
  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: 'auth-code'
  })

  const handlechange = (e) => {
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
      return toast.error("email or password are required", {
        position: "top-center",
        autoClose: 2000
      })
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
      const { message, success, jwttoken, name, email, _id, error } = result
      console.log("The logged user data :: " + result)
      if (success) {
        toast.success(message, {
          position: "top-center",
          autoClose: 2000
        })
        localStorage.setItem('email', result.email)
        localStorage.setItem('token', jwttoken)
        localStorage.setItem('name', name)
        localStorage.setItem('userId', _id)
        localStorage.removeItem('image')
        setTimeout(() => {
          Navigate('/home')
        }, 1000)
      } else if (error) {
        const details = error?.details[0].message
        toast.error(details, {
          position: "top-center",
          autoClose: 2000
        })
      } else if (!success) {
        toast.error(message, {
          position: "top-center",
          autoClose: 2000
        })
      }
      // console.log(result);
    } catch (error) {
      toast.error(error, {
        position: "top-center",
        autoClose: 2000
      })
    }
  };


  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/white-gradient-abstract-curve-pattern-free-photo.jpg')",
      }}
    >
      <div className="w-full max-w-6xl mx-auto p-4">
        {/* Navbar */}
        <nav className="flex justify-between items-center py-4">
          <ul className="flex space-x-6">
            {["Home", "About", "Blog", "Pages", "Contact"].map((item) => (
              <li key={item}>
                <a className="text-black hover:text-gray-400" href="#">
                  {item}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center space-x-4">
            <a className="text-black" href="#">Login</a>
            <button
              className="bg-black text-white px-4 py-2 rounded-full"
              onClick={() => navigate("/signup")}
            >
              Register
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-center justify-center lg:space-x-8 mt-8 bg-white bg-opacity-70 p-6 rounded-lg">
          {/* Left Side - Image */}
          <img
            src="https://storage.googleapis.com/a1aa/image/N0asow23DN_dD6Bnu1zNkoj15ysSrL2j8KWObgHcZ5I.jpg"
            alt="Futuristic Robot"
            className="w-full lg:w-1/2 rounded-lg"
          />

          {/* Right Side - Login Form */}
          <div className="w-full lg:w-1/2 mt-8 lg:mt-0 text-black p-8 rounded-lg">
            <h1 className="text-3xl font-bold mb-4">
              Hello !<br /> Welcome Back
            </h1>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <input
                  type="email"
                  name="email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200 text-black"
                  placeholder="Enter Email"
                  onChange={handlechange}
                  value={logininfo.email}
                />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200 text-black pr-10"
                  placeholder="••••••••"
                  onChange={handlechange}
                  value={logininfo.password}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-2 flex items-center px-2 text-black"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
                </button>
                <a className="text-sm text-blue-500 mt-2 inline-block" href="#">
                  Recover Password?
                </a>
              </div>
              <button className="w-full bg-black text-white py-2 rounded-lg" type="submit">
                Login
              </button>
            </form>

            <div className="flex items-center my-4">
              <hr className="flex-grow border-t border-gray-300" />
              <span className="px-4 text-gray-500">Or continue with</span>
              <hr className="flex-grow border-t border-gray-300" />
            </div>

            {/* Social Buttons */}
            <div className="flex space-x-4 justify-center cursor-pointer" onClick={googleLogin}>
              <button class="flex items-center justify-center gap-3 w-full bg-white dark:bg-gray-900 border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 dark:text-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                <svg class="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="800px" height="800px" viewBox="-0.5 0 48 48" version="1.1"> <title>Google-color</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Color-" transform="translate(-401.000000, -860.000000)"> <g id="Google" transform="translate(401.000000, 860.000000)"> <path d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24" id="Fill-1" fill="#FBBC05"> </path> <path d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333" id="Fill-2" fill="#EB4335"> </path> <path d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667" id="Fill-3" fill="#34A853"> </path> <path d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24" id="Fill-4" fill="#4285F4"> </path> </g> </g> </g> </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            <p className="text-center mt-4">
              Don't Have an account?{" "}
              <button className="text-blue-500" onClick={() => navigate("/signup")}>
                Create Account
              </button>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
