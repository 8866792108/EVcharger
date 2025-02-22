import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import s1 from "../assets/img/s1.png";
import s2 from "../assets/img/s2.png";
import s3 from "../assets/img/s3.png";
import s4 from "../assets/img/S4.png";

const vehicles = [
  {
    id: 1,
    name: "OLA",
    image: s1,
    engine: "1200 CC",
    speed: "450 KM/H",
    power: "380 HP",
    category: "MotorBikes",
  },
  {
    id: 2,
    name: "ATHER 450X",
    image: s2,
    engine: "Electric Motor",
    speed: "250 KM/H",
    power: "670 HP",
    category: "MotorBikes",
  },
  {
    id: 3,
    name: "TVS IQUBE",
    image: s3,
    engine: "Electric",
    speed: "320 KM/H",
    power: "300 HP",
    category: "MotorBikes",
  },
  {
    id: 4,
    name: "BAJAJ CHETAK",
    image: s4,
    engine: "Electric",
    speed: "",
    power: "300 HP",
    category: "MotorBikes",
  },
];

const categories = ["All", "Cars", "MotorBikes", "Bicycles", "AutoRickshaws", "DC Motors", "AC Motors"];

const FuturisticVehicleSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredVehicles = selectedCategory === "All"
    ? vehicles
    : vehicles.filter((vehicle) => vehicle.category === selectedCategory);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredVehicles.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredVehicles.length) % filteredVehicles.length);
  };

  // Swipe Gesture Handling
  const handlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <div
      {...handlers}
      className="relative w-full min-h-screen bg-black text-white flex items-center justify-center px-10"
    >
      {/* Filter Dropdown - Positioned at the Top-Right */}
      <div className="absolute top-5 right-10 ">
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentIndex(0); // Reset slider when category changes
          }}
          className="bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-600"
        >
          {categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <AnimatePresence mode="wait">
        {filteredVehicles.length > 0 ? (
          <motion.div
            key={filteredVehicles[currentIndex].id}
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -50 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="relative flex items-center justify-center w-full max-w-6xl"
          >
            {/* Left - Vehicle Image */}
            <div className="flex-1 flex items-center justify-center">
              <img
                src={filteredVehicles[currentIndex].image}
                alt={filteredVehicles[currentIndex].name}
                className="w-full max-w-xl object-contain h-[500px]"
              />
            </div>

            {/* Right - Vehicle Specs */}
            <div className="flex-1 flex flex-col items-start space-y-4 pl-10">
              <h3 className="text-3xl font-semibold">Specifications</h3>
              <p className="text-lg">🚀 <span className="font-semibold">Engine:</span> {filteredVehicles[currentIndex].engine}</p>
              <p className="text-lg">⚡ <span className="font-semibold">Top Speed:</span> {filteredVehicles[currentIndex].speed}</p>
              <p className="text-lg">🏎️ <span className="font-semibold">Horse Power:</span> {filteredVehicles[currentIndex].power}</p>
              <button className="mt-4 bg-blue-500 px-6 py-3 text-white rounded-full hover:bg-blue-700 transition">
                See More
              </button>
            </div>

            {/* Vehicle Name at the Bottom */}
            <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gray-900 bg-opacity-80 px-8 py-3 rounded-full text-lg font-bold shadow-lg">
              {filteredVehicles[currentIndex].name}
            </div>
          </motion.div>
        ) : (
          <div className="text-center text-xl font-semibold">No Vehicles Available</div>
        )}
      </AnimatePresence>

      {/* Navigation Arrows */}
      {filteredVehicles.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-10 text-3xl bg-gray-800 p-3 rounded-full hover:bg-gray-700 transition"
          >
            ◀
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-10 text-3xl bg-gray-800 p-3 rounded-full hover:bg-gray-700 transition"
          >
            ▶
          </button>
        </>
      )}

      {/* Dots Indicator */}
      <div className="absolute bottom-6 flex space-x-2">
        {filteredVehicles.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-white" : "bg-gray-500"}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default FuturisticVehicleSlider;
