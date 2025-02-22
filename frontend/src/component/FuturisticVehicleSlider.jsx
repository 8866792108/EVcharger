import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import s1 from "../assets/img/s1.png";
import s2 from "../assets/img/s2.png";
import s3 from "../assets/img/s3.png";
import s4 from "../assets/img/S4.png";
import s5 from "../assets/img/s5.png";
import s6 from "../assets/img/s6.png";
import s7 from "../assets/img/s7.png";
import s8 from "../assets/img/s8.png";
import c1 from "../assets/img/c1.png";
import c2 from "../assets/img/c2.png";
import c3 from "../assets/img/c3.png";
import c4 from "../assets/img/c4.png";
import c5 from "../assets/img/c5.png";
import c6 from "../assets/img/c6.png";
import c7 from "../assets/img/c7.png";
import b1 from "../assets/img/b1.png";
import b2 from "../assets/img/b2.png";
import A1 from "../assets/img/A1.png";
import A2 from "../assets/img/A2.png";
import A3 from "../assets/img/A3.png";

const vehicles = [
  {
    id: 1,
    name: "OLA",
    image: s1,
    engine: "Electric Moter",
    speed: "120 KPH",
    power: "11 KW",
    category: "MotorBikes",
  },
  {
    id: 2,
    name: "ATHER 450X",
    image: s2,
    engine: "Electric Motor",
    speed: "90 KPH",
    power: "6.4 KW",
    category: "MotorBikes",
  },
  {
    id: 3,
    name: "TVS IQUBE",
    image: s3,
    engine: "Electric",
    speed: "81 KPH",
    power: "4.4 KW",
    category: "MotorBikes",
  },
  {
    id: 4,
    name: "BAJAJ CHETAK",
    image: s4,
    engine: "Electric",
    speed: "73 KPH",
    power: "4 KW",
    category: "MotorBikes",
  },
  {
    id: 5,
    name: "TESLA",
    image: c1,
    engine: "Electric",
    speed: "320 KPH",
    power: "1020 HP",
    category: "Cars",
  },
  {
    id: 6,
    name: "WHITE TESLA",
    image: c2,
    engine: "Electric",
    speed: "320 KPH",
    power: "1020 HP",
    category: "Cars",
  },
  {
    id: 7,
    name: "Mersedes-Benz G 580",
    image: c3,
    engine: "Electric",
    speed: "180 KPH",
    power: "587 HP",
    category: "Cars",
  },
  {
    id: 8,
    name: "Lamborgini Urus",
    image: c4,
    engine: "Electric",
    speed: "312 KPH",
    power: "588 KW",
    category: "Cars",
  },
  {
    id: 9,
    name: "Mahendra XEV BE",
    image: c5,
    engine: "Electric",
    speed: "202 KPH",
    power: "228 HP",
    category: "Cars",
  },
  {
    id: 10,
    name: "Tata Curvv Ev",
    image: c6,
    engine: "Electric",
    speed: "160 KPH",
    power: "55 KW",
    category: "Cars",
  },
  {
    id: 11,
    name: "BMW i7",
    image: c7,
    engine: "Electric",
    speed: "250 KPH",
    power: "660 HP",
    category: "Cars",
  },
  {
    id: 12,
    name: "Hummer Ev",
    image: b1,
    engine: "Electric",
    speed: "45 KPH",
    power: "1200 watts",
    category: "Bicycles",
  },
  {
    id: 13,
    name: "STROOM!",
    image: b2,
    engine: "Electric",
    speed: "45 KPH",
    category: "Bicycles",
  },
  {
    id: 14,
    name: "Mahendra TREO",
    image: A1,
    engine: "Electric",
    speed: "55 KPH",
    power: "8 KW",
    category: "AutoRickshaws",
  },
  {
    id: 15,
    name: "GK Rikshaws",
    image: A2,
    engine: "Electric",
    speed: "25 KPH",
    power: "1 HP",
    category: "AutoRickshaws",
  },
  {
    id: 16,
    name: "Mahendra TREO",
    image: A3,
    engine: "Electric",
    speed: "55 KPH",
    power: "8 KW",
    category: "AutoRickshaws",
  },
  {
    id: 17,
    name: "Hero Vida v1 Pro",
    image: s5,
    engine: "Electric",
    speed: "80 KPH",
    power: "5 kw",
    category: "MotorBikes",
  },
  {
    id: 18,
    name: "Rorr Ez",
    image: s6,
    engine: "Electric",
    speed: "95 KPH",
    power: "7.5 kw",
    category: "MotorBikes",
  },
  {
    id: 19,
    name: "Revolt Rv1",
    image: s7,
    engine: "Electric",
    speed: "70 kph",
    power: "2.8 KW",
    category: "MotorBikes",
  },
  {
    id: 20,
    name: "OLA Roadster",
    image: s8,
    engine: "Electric",
    speed: "125 KPH",
    power: "11 KW",
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
