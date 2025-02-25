import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);


  const [logininfo, setlogininfo] = useState({
    email: '',
    password: ''
  })

  const Navigate = useNavigate()

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
      const { message, success, jwttoken, name, error } = result
      console.log("The logged user data :: " + result)
      if (success) {
        toast.success(message, {
          position: "top-center",
          autoClose: 2000
        })
        localStorage.setItem('user_email', email)
        localStorage.setItem('token', jwttoken)
        localStorage.setItem('loggeduser', name)
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
            <div className="flex space-x-4 justify-center">
              {["google", "apple", "facebook"].map((icon) => (
                <button key={icon} className="bg-gray-100 p-2 rounded-full">
                  <i className={`fab fa-${icon}`} />
                </button>
              ))}
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
