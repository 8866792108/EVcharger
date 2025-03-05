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
import { NavLink } from "react-router-dom";

const vehicles = [
  {
    id: 1,
    name: "OLA",
    image: s1,
    engine: "Electric Moter",
    speed: "120 KPH",
    power: "11 KW",
    category: "Bikes",
  },
  {
    id: 2,
    name: "ATHER 450X",
    image: s2,
    engine: "Electric Motor",
    speed: "90 KPH",
    power: "6.4 KW",
    category: "Bikes",
  },
  {
    id: 3,
    name: "TVS IQUBE",
    image: s3,
    engine: "Electric",
    speed: "81 KPH",
    power: "4.4 KW",
    category: "Bikes",
  },
  {
    id: 4,
    name: "BAJAJ CHETAK",
    image: s4,
    engine: "Electric",
    speed: "73 KPH",
    power: "4 KW",
    category: "Bikes",
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
    category: "Bikes",
  },
  {
    id: 18,
    name: "Rorr Ez",
    image: s6,
    engine: "Electric",
    speed: "95 KPH",
    power: "7.5 kw",
    category: "Bikes",
  },
  {
    id: 19,
    name: "Revolt Rv1",
    image: s7,
    engine: "Electric",
    speed: "70 kph",
    power: "2.8 KW",
    category: "Bikes",
  },
  {
    id: 20,
    name: "OLA Roadster",
    image: s8,
    engine: "Electric",
    speed: "125 KPH",
    power: "11 KW",
    category: "Bikes",
  },
];

const categories = ["All", "Cars", "Bikes", "Bicycles", "AutoRickshaws", "DC Motors", "AC Motors"];

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

  const handlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <motion.div
      {...handlers}
      className="relative w-full min-h-screen bg-gradient-to-b from-black via-gray-900 to-black 
        text-white flex items-center justify-center px-10 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-green-500/20" />
        <div className="charging-particles" />
      </div>

      {/* Category Filter */}
      <motion.div 
        className="absolute top-8 right-10 z-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentIndex(0);
          }}
          className="bg-gray-800/80 text-white px-6 py-3 rounded-full border border-gray-600 
            backdrop-blur-sm hover:bg-gray-700/80 transition-all cursor-pointer focus:outline-none 
            focus:ring-2 focus:ring-blue-500"
        >
          {categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
      </motion.div>

      <AnimatePresence mode="wait">
        {filteredVehicles.length > 0 ? (
          <motion.div
            key={filteredVehicles[currentIndex].id}
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -50 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="relative flex flex-col md:flex-row items-center justify-center w-full max-w-7xl 
              bg-gray-900/40 backdrop-blur-md rounded-3xl p-8 border border-gray-800"
          >
            {/* Left - Vehicle Image */}
            <motion.div 
              className="flex-1 flex items-center justify-center p-4"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={filteredVehicles[currentIndex].image}
                alt={filteredVehicles[currentIndex].name}
                className="w-full max-w-xl object-contain h-[500px] drop-shadow-2xl"
              />
            </motion.div>

            {/* Right - Vehicle Specs */}
            <div className="flex-1 flex flex-col items-start space-y-6 pl-10">
              <motion.h2
                className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-green-400 
                  bg-clip-text text-transparent"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {filteredVehicles[currentIndex].name}
              </motion.h2>

              <motion.div 
                className="space-y-4 w-full"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <SpecCard icon="🚀" label="Engine" value={filteredVehicles[currentIndex].engine} />
                <SpecCard icon="⚡" label="Top Speed" value={filteredVehicles[currentIndex].speed} />
                <SpecCard icon="🏎️" label="Power" value={filteredVehicles[currentIndex].power} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="w-full pt-6"
              >
                <NavLink 
                  to={`/stations/${filteredVehicles[currentIndex].category}`}
                  className="block w-full text-center bg-gradient-to-r from-blue-500 to-green-500 
                    px-8 py-4 text-white rounded-full text-lg font-semibold
                    hover:shadow-lg hover:shadow-blue-500/20 transform hover:-translate-y-1 
                    transition-all duration-300"
                >
                  Charge Now ⚡
                </NavLink>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="text-center text-2xl font-semibold bg-gray-900/60 backdrop-blur-sm 
              rounded-xl p-8 border border-gray-800"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            No Vehicles Available
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Arrows */}
      {filteredVehicles.length > 1 && (
        <>
          <NavButton direction="left" onClick={prevSlide}>◀</NavButton>
          <NavButton direction="right" onClick={nextSlide}>▶</NavButton>
        </>
      )}

      {/* Progress Indicator */}
      <motion.div 
        className="absolute bottom-8 flex space-x-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {filteredVehicles.map((_, index) => (
          <motion.div
            key={index}
            className={`w-2.5 h-2.5 rounded-full cursor-pointer 
              ${index === currentIndex ? 'bg-gradient-to-r from-blue-400 to-green-400' : 'bg-gray-600'}`}
            whileHover={{ scale: 1.2 }}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

// Reusable Components
const SpecCard = ({ icon, label, value }) => (
  <motion.div 
    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700
      hover:bg-gray-800/70 transition-all duration-300"
    whileHover={{ scale: 1.02 }}
  >
    <div className="flex items-center space-x-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  </motion.div>
);

const NavButton = ({ children, direction, onClick }) => (
  <motion.button
    onClick={onClick}
    className={`absolute ${direction === 'left' ? 'left-6' : 'right-6'} top-1/2 -translate-y-1/2 
      bg-gray-800/80 backdrop-blur-sm text-2xl p-4 rounded-full border border-gray-700
      hover:bg-gray-700/80 transition-all duration-300`}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
  >
    {children}
  </motion.button>
);

export default FuturisticVehicleSlider;
