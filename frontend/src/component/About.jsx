"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import styled from "styled-components"
import { motion } from "framer-motion"
import axios from "axios"
import Navbar from "./Navbar"
import ReactStars from "react-rating-stars-component"

const AboutUs = () => {
  const navigate = useNavigate()
  const [feedback, setFeedback] = useState(
    {
      name: localStorage.getItem('name') || "",
      email: localStorage.getItem('email') || "",
      message: "",
      rating: 0
    })
  const [activeTimelineItem, setActiveTimelineItem] = useState(0)

  const handleFeedbackChange = (e) => {
    const { name, value } = e.target
    setFeedback((prev) => ({ ...prev, [name]: value }))
  }

  const handleRatingChange = (newRating) => {
    setFeedback((prev) => ({ ...prev, rating: newRating }))
  }

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault()

    if (!localStorage.getItem("token")) {
      setTimeout(() => {
        toast.error("You need to log in before submitting feedback.", {
          position: "top-center",
          autoClose: 2000,
        })
      }, 500);
      return navigate("/login")
    }

    const formdata = new FormData()
    formdata.append("name", feedback.name)
    formdata.append("email", feedback.email)
    formdata.append("message", feedback.message)
    formdata.append("rating", feedback.rating)
    formdata.append("userId", localStorage.getItem('userId'))

    try {
      const url = "http://localhost:8080/feedback/add"

      const response = await axios.post(url, formdata, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      const { message, success, error } = await response.data

      if (success) {
        toast.success(message, {
          position: "top-center",
          autoClose: 2000,
        })
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else if (error) {
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
    setFeedback({ name: "", email: "", message: "", rating: 0 })
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTimelineItem((prev) => (prev + 1) % timelineItems.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const teamMembers = [
    { name: "Sanjay Madta", role: "CEO & Founder", image: "../src/assets/about/ceo.jpg" },
    { name: "Head of the DepartMent", role: "CTO", image: "./placeholder.svg?height=200&width=200" },
  ]

  const timelineItems = [
    { year: 2020, event: "VOLTHUB founded with a vision to revolutionize electric mobility" },
    { year: 2021, event: "Launched our first electric bike model, the VoltCruiser" },
    { year: 2022, event: "Expanded to 10 countries across Europe and North America" },
    { year: 2023, event: "Introduced the groundbreaking VoltSprint, our fastest e-bike yet" },
    { year: 2024, event: "Reached 1 million satisfied customers worldwide" },
  ]

  return (
    <div className="bg-black min-h-screen text-white flex flex-col">
      {/* Navbar */}
      <nav className="py-4 sm:py-6 px-4 sm:px-6 md:px-10 flex justify-between items-center border-b border-gray-800 z-[500]">
        <Navbar />
      </nav>

      {/* Main Content */}
      <main className="flex-grow p-4 sm:p-6 md:p-8 lg:p-10">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <section className="text-center mb-8 sm:mb-12 md:mb-16">
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Powering the Future of Mobility
            </motion.h1>
            <motion.p
              className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              At VOLTHUB, we're not just creating electric bikes. We're crafting a sustainable future, one ride at a
              time.
            </motion.p>
            <FuturisticLine />
          </section>

          {/* Mission Statement */}
          <section className="mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Our Mission</h2>
            <p className="text-base sm:text-lg text-gray-300">
              VOLTHUB is on a mission to transform urban mobility through innovative electric bike solutions. We believe
              in a world where clean, efficient transportation is accessible to everyone, reducing our carbon footprint
              while enhancing the joy of the journey.
            </p>
          </section>

          {/* Team Section */}
          <section className="mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Meet Our Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  className="bg-gray-900 p-4 sm:p-6 rounded-lg text-center"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto mb-3 sm:mb-4 bg-cover bg-center bg-no-repeat"
                  />
                  <h3 className="text-lg sm:text-xl font-semibold">{member.name}</h3>
                  <p className="text-blue-400 text-sm sm:text-base">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Timeline Section */}
          <section className="mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Our Journey</h2>
            <div className="relative">
              {timelineItems.map((item, index) => (
                <motion.div
                  key={item.year}
                  className={`flex items-center mb-4 sm:mb-6 md:mb-8 ${index % 2 === 0 ? "justify-start" : "justify-end"}`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <div className={`w-full sm:w-1/2 ${index % 2 === 0 ? "text-right pr-4 sm:pr-8" : "text-left pl-4 sm:pl-8"}`}>
                    <h3 className="text-xl sm:text-2xl font-bold text-blue-400">{item.year}</h3>
                    <p className="text-sm sm:text-base text-gray-300">{item.event}</p>
                  </div>
                  <div
                    className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${index === activeTimelineItem ? "bg-blue-500" : "bg-gray-700"}`}
                  ></div>
                </motion.div>
              ))}
              <div className="absolute top-0 bottom-0 left-1/2 w-0.5 sm:w-1 bg-gray-700 -ml-0.5"></div>
            </div>
          </section>

          {/* Feedback Section */}
          <section className="mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">We Value Your Feedback</h2>
            <form onSubmit={handleFeedbackSubmit} className="bg-gray-900 p-4 sm:p-6 md:p-8 rounded-lg">
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <FuturisticInput
                  type="text"
                  id="name"
                  name="name"
                  value={feedback.name}
                  onChange={handleFeedbackChange}
                  disabled={localStorage.getItem("name")}
                  placeholder="Your Name"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <FuturisticInput
                  type="email"
                  id="email"
                  name="email"
                  value={feedback.email}
                  onChange={handleFeedbackChange}
                  disabled={localStorage.getItem("email")}
                  placeholder="Your Email"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Rating
                </label>
                <ReactStars
                  count={5}
                  onChange={handleRatingChange}
                  size={30}
                  activeColor="#ffd700"
                  value={feedback.rating}
                  isHalf={false}
                  classNames="mb-2 hover:cursor-pointer hover:scale-110 transition-all duration-300 hover:text-blue-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <FuturisticTextarea
                  id="message"
                  name="message"
                  value={feedback.message}
                  onChange={handleFeedbackChange}
                  placeholder="Your Feedback"
                  required
                />
              </div>
              <FuturisticButton type="submit">Submit Feedback</FuturisticButton>
            </form>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 sm:py-6 px-4 sm:px-6 md:px-10 border-t border-gray-800 text-center text-gray-500">
        <p className="text-sm sm:text-base">© 2024 VOLTHUB. All rights reserved.</p>
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

const NavLink = styled.a`
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

const FuturisticTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: rgba(17, 24, 39, 0.8);
  border: 1px solid #374151;
  border-radius: 0.375rem;
  color: white;
  transition: all 0.3s ease;
  min-height: 150px;
  resize: vertical;
  
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

const FuturisticLine = styled.div`
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #22c55e);
  border-radius: 2px;
  position: relative;
  margin: 2rem auto;
  
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

export default AboutUs

