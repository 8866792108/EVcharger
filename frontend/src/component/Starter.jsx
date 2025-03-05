import React, { useState, useEffect } from 'react'
import IntroSlider from './IntroSlider'
import Home from './Home'
import { useNavigate } from 'react-router-dom'

const Starter = () => {
  const [showIntro, setShowIntro] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem("hasSeenIntro")
    if (hasSeenIntro === "true") {
      handleIntroComplete()
    }
  }, [])

  const handleIntroComplete = () => {
    setShowIntro(false)
    navigate('/home')
  }

  return (
    <>
      {showIntro && <IntroSlider onComplete={handleIntroComplete} />}
    </>
  )
}

export default Starter 