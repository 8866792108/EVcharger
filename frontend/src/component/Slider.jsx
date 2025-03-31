import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import slides from "../assets/img/imgdata"; // Import images
import "./Slider.css";

export default function CarSlider({ scrollToSection, url }) {  // Accept scroll function as prop
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-screen bg-black overflow-hidden">
      {/* Image Slider */}
      <div className="relative w-full h-full flex items-center justify-center">
        <AnimatePresence custom={direction} mode="wait">
          <motion.img
            key={current}
            src={slides[current].image}
            alt="Vehicle"
            className="absolute w-full h-full object-cover brightness-50"
            initial={{ x: direction * 1000, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -direction * 1000, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </AnimatePresence>
      </div>

      {/* Information Section */}
      <div className="absolute top-1/4 left-4 sm:left-8 md:left-20 bg-opacity-70 p-4 sm:p-6 md:p-8 rounded-xl text-white w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] shadow-lg">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4">
          Discover <span className="text-green-400">Electric Freedom</span> with{" "}
          <span className="font-extrabold">VOLTHUB</span>
        </h1>
        <p className="text-sm sm:text-md md:text-lg text-white leading-relaxed opacity-90 mb-3 sm:mb-4">
          Experience the future of mobility with our advanced electric vehicle solutions, designed for efficiency and sustainability.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <motion.button
            onClick={scrollToSection}
            className="button-74 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Let's Charged ⚡
          </motion.button>
          <motion.button
            className="button-75 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Our Services
          </motion.button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <motion.button
        onClick={handlePrev}
        className="absolute left-4 sm:left-6 top-1/2 transform -translate-y-1/2 p-2 sm:p-3 bg-black/30 hover:bg-black/50 rounded-full text-white transition-colors duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </motion.button>

      <motion.button
        onClick={handleNext}
        className="absolute right-4 sm:right-6 top-1/2 transform -translate-y-1/2 p-2 sm:p-3 bg-black/30 hover:bg-black/50 rounded-full text-white transition-colors duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </motion.button>

      {/* Progress Indicators */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors duration-300 ${index === current ? "bg-white" : "bg-white/50"
              }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </div>
  );
}
