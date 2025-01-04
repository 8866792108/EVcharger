import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handleerror, handlesuccess } from "../assets/utility"
import { Upload, User } from "lucide-react";
import axois from 'axios'
const SignUp = () => {

  const [signupinfo, setsignupinfo] = useState({
    name: '',
    email: '',
    password: ''
  })

  const [Image, setImage] = useState({
    previewurl: null,
    file: null
  })

  const handlePhotoChange = e => {
    if (e.target.files[0].type === 'image/png' || e.target.files[0].type === 'image/jpeg') {
      //preview show
      const reader = new FileReader()
      reader.onload = (r) => {
        setImage({
          previewurl: r.target.result,
          file: e.target.files[0]
        })
        console.log(r.target.result);
        console.log(e.target.files[0])
      }
      reader.readAsDataURL(e.target.files[0])
    } else {
      handleerror("Invalid File !!")
      Image.file = null
    }

  }
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
    console.log("Your name is: ", signupinfo.name);
    const formdata = new FormData();
    formdata.append("image", Image.file)
    formdata.append("name", signupinfo.name)
    formdata.append("email", signupinfo.email)
    formdata.append("password", signupinfo.password)

    try {
      const url = "http://localhost:8080/user/signup"

      const response = await axois.post(url, formdata, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      console.log(response)
      const result = await response.json()
      const { message, success, error } = result
      if (success) {
        handlesuccess(message)
        setTimeout(() => {
          Navigate('/login')
        }, 1000)
      } else if (error) {
        console.log(error)
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-pink-500">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-pink-400 to-blue-400 mx-auto mb-4">

          </div>
          <h1 className="text-3xl font-bold text-blue-500 mb-6">Sign Up</h1>
        </div>

        <form onSubmit={handleSubmit} className=" text-black">
          <div className="flex justify-center">
            <div className="relative mb-10">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {Image.previewurl ? (
                  <img
                    src={Image.previewurl}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-gray-400" />
                )}
              </div>
              <label
                htmlFor="photo-upload"
                className="absolute bottom-0 right-0 bg-green-600 rounded-full p-2 cursor-pointer"
              >
                <Upload className="h-4 w-4 text-white" />
              </label>
              <input
                id="photo-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handlePhotoChange}
              />
            </div>
          </div>
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
