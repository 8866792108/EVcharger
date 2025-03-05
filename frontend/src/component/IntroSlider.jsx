"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import intro1 from '../assets/img/inro 1.jpg'
import intro2 from '../assets/img/intro 2.jpg'
import intro3 from '../assets/img/intro 3.jpg'
import intro4 from '../assets/img/intro 4.jpg'

const IntroSlider = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const navigate = useNavigate()

  const slides = [
    {
      title: "Welcome to VOLTHUB",
      description: "Your one-stop solution for EV charging station bookings",
      caption: "Book charging slots anytime, anywhere",
      image: intro1,
      color: "from-blue-600 to-green-500"
    },
    {
      title: "Easy Slot Booking",
      description: "Find and reserve charging stations in just a few clicks",
      caption: "Real-time availability & instant confirmation",
      image: intro2,
      color: "from-green-600 to-teal-500"
    },
    {
      title: "Smart Charging Network",
      description: "Access our wide network of charging stations across the city",
      caption: "Multiple charging options for all EV types",
      image: intro3,
      color: "from-purple-600 to-blue-500"
    },
    {
      title: "Join VOLTHUB Today",
      description: "Experience hassle-free EV charging slot management",
      caption: "24/7 support & secure payments",
      image: intro4,
      color: "from-orange-600 to-pink-500"
    },
  ]

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      completeIntro()
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const completeIntro = () => {
    localStorage.setItem("hasSeenIntro", "true")
    onComplete()
  }

  return (
    <SliderContainer>
      {/* Background Animation */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].color} opacity-20`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1 }}
      />

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 bg-white rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex flex-col items-center justify-center px-4 md:px-10 max-w-6xl mx-auto"
        >
          {/* Image Container */}
          <motion.div
            className="relative mb-8 w-full max-w-4xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              className="w-full h-[60vh] object-cover rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/50 to-transparent" />
            
            {/* Caption Badge */}
            <motion.div
              className="absolute bottom-6 left-6 right-6 bg-black/60 backdrop-blur-sm px-6 py-4 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${slides[currentSlide].color}`}>
                  <svg 
                    className="w-5 h-5 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <p className="text-lg md:text-xl text-white font-medium">
                  {slides[currentSlide].caption}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Text Content */}
          <motion.h2
            className="text-5xl md:text-6xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {slides[currentSlide].title}
          </motion.h2>
          
          <motion.p
            className="text-xl md:text-2xl text-center max-w-2xl text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {slides[currentSlide].description}
          </motion.p>

          {/* Features List */}
          <motion.div
            className="mt-8 flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {[
              "Instant Booking",
              "24/7 Availability",
              "Secure Payment",
              "Live Status"
            ].map((feature, index) => (
              <motion.div
                key={feature}
                className="px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <span className="text-sm font-medium text-white">
                  {feature}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Progress Indicators */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-center space-x-4">
        {slides.map((_, index) => (
          <motion.div
            key={index}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              index === currentSlide ? "bg-white" : "bg-gray-500"
            }`}
            whileHover={{ scale: 1.2 }}
            onClick={() => setCurrentSlide(index)}
            initial={false}
            animate={{
              scale: index === currentSlide ? 1.2 : 1,
              opacity: index === currentSlide ? 1 : 0.5,
            }}
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      <ButtonContainer>
        {currentSlide > 0 && (
          <NavButton
            onClick={prevSlide}
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            Previous
          </NavButton>
        )}
        <NavButton
          onClick={nextSlide}
          whileHover={{ scale: 1.05, x: 5 }}
          whileTap={{ scale: 0.95 }}
          className={`bg-gradient-to-r ${slides[currentSlide].color}`}
        >
          {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
        </NavButton>
      </ButtonContainer>

      {/* Action Buttons */}
      <motion.div
        className="absolute top-6 right-6 flex items-center gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <SkipButton
          onClick={completeIntro}
          whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
          whileTap={{ scale: 0.95 }}
        >
          Skip Intro
        </SkipButton>
        <LoginButton
          onClick={() => navigate("/login")}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          className={`bg-gradient-to-r ${slides[currentSlide].color}`}
        >
          Login
        </LoginButton>
      </motion.div>
    </SliderContainer>
  )
}

const SliderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #0a0a0a;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  overflow: hidden;
`

const ButtonContainer = styled(motion.div)`
  position: absolute;
  bottom: 10px;
  display: flex;
  justify-content: center;
  gap: 20px;
  width: 100%;
`

const NavButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 50px;
  cursor: pointer;
  font-weight: bold;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`

const SkipButton = styled(motion.button)`
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.5);
  padding: 8px 16px;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
`

const LoginButton = styled(motion.button)`
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 50px;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
`

export default IntroSlider 