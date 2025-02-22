import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import slides from "../assets/img/imgdata"; // Import images
import "./Slider.css";

export default function CarSlider({ scrollToSection }) {  // Accept scroll function as prop
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
    <div className="relative w-full h-screen bg-black overflow-hidden">
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

      {/* Improved Information Section */}
      <div className="absolute top-1/4 left-10 md:left-20 bg-opacity-70 p-6 rounded-xl text-white w-[90%] md:w-[40%] shadow-lg">
        <h1 className="text-3xl font-bold mb-3">Discover <span className="text-green-400">Electric Freedom</span> with <span className="font-extrabold">VOLTHUB</span></h1>
        <p className="text-base text-white leading-relaxed opacity-90 mb-4">Experience the future of mobility with our advanced electric vehicle solutions, designed for efficiency and sustainability.</p>
        <div className="flex space-x-4">
          {/* Trigger the scroll function on click */}
          <button onClick={scrollToSection} className="button-74">Let's Charged ⚡</button>
          <button className="button-75">Our Services</button>
        </div>
      </div>
    </div>
  );
}
