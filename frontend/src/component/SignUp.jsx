import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const SignUp = () => {


  const [signupinfo, setsignupinfo] = useState({
    name: '',
    email: '',
    password: '',
    confirmpwd: ''
  })

  const Navigate = useNavigate()

  const handlechange = (e) => {
    const { name, value } = e.target
    const copysignupinfo = { ...signupinfo }
    copysignupinfo[name] = value
    setsignupinfo(copysignupinfo)
    console.log(signupinfo)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmpwd } = signupinfo

    if (password != confirmpwd) {
      return toast.error("Both password is not same", {
        position: "top-center",
        autoClose: 2000
      })
    }
    console.log("Your name is: ", signupinfo.name);
    const formdata = new FormData()
    formdata.append("name", name)
    formdata.append("email", email)
    formdata.append("password", password)

    console.log(formdata);


    try {
      const url = "http://localhost:8080/user/signup"

      const response = await axios.post(url, formdata, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      console.log("this is the response data::: " + response.data)
      const { message, success, error } = await response.data
      // console.log(message, success, error);

      if (success) {
        toast.success(message, {
          position: "top-center",
          autoClose: 2000
        })
        setTimeout(() => {
          Navigate('/login')
        }, 1000)
      } else if (error) {
        console.log(error)
        const details = error?.details[0].message
        toast.error(details, {
          position: "top-center",
          autoClose: 2000
        })
      } else {
        toast.error(message, {
          position: "top-center",
          autoClose: 2000
        })
      }

    } catch (error) {
      toast.error(error, {
        position: "top-center",
        autoClose: 2000
      })
    }
  };

  return (
    <div className="bg-white text-black min-h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-6xl mx-auto p-4">
        {/* Navbar */}
        <nav className="flex justify-between items-center py-4">
          <ul className="flex space-x-6">
            {["Home", "About", "Blog", "Pages", "Contact"].map((item) => (
              <li key={item}>
                <a className="text-black hover:text-gray-400" href="#">{item}</a>
              </li>
            ))}
          </ul>
          <div className="flex items-center space-x-4">
            <a className="text-black" href="#">English</a>
            <a className="text-black" href="#">Sign in</a>
            <a className="bg-black text-white px-4 py-2 rounded-full" href="#">Register</a>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-center justify-center lg:space-x-8 mt-8">
          {/* Right Side - Signup Form */}
          <div className="w-full lg:w-1/2 mt-8 lg:mt-0 bg-transparent text-black p-8 rounded-lg">
            <h1 className="text-3xl font-bold mb-4">Hello!<br /> Create Your Account</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  name="name"
                  onChange={handlechange}
                  value={signupinfo.name}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Enter Email</label>
                <input
                  type="email"
                  name="email"
                  onChange={handlechange}
                  value={signupinfo.email}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Password</label>
                <input
                  type="password"
                  name="password"
                  onChange={handlechange}
                  value={signupinfo.password}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Confirm Password</label>
                <input
                  type="password"
                  name="confirmpwd"
                  onChange={handlechange}
                  value={signupinfo.confirmpwd}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="w-full bg-black text-white py-2 rounded-lg" type="submit">Sign Up</button>
            </form>

            <div className="flex items-center my-4">
              <hr className="flex-grow border-t border-gray-300" />
              <span className="px-4 text-gray-500">Or sign up with</span>
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
              Already have an account? <a className="text-blue-500" href="/login">Sign In</a>
            </p>
          </div>

          {/* Left Side - Image */}
          <img
            src="https://storage.googleapis.com/a1aa/image/N0asow23DN_dD6Bnu1zNkoj15ysSrL2j8KWObgHcZ5I.jpg"
            alt="Futuristic Robot"
            className="w-full lg:w-1/2 rounded-lg"
          />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
