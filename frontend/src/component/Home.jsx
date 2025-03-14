import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import CarSlider from "./Slider";
import Footer from "./Footer";
import FuturisticVehicleSlider from "./FuturisticVehicleSlider";
import VolthubMission from "./VolthubMission";
import IntroSlider from "./IntroSlider";
import { FaBolt, FaChargingStation, FaClock, FaMapMarkedAlt } from "react-icons/fa";

const Home = () => {
  const [showIntro, setShowIntro] = useState(false);
  const navigate = useNavigate();
  const futuristicSectionRef = useRef(null);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  const scrollToFuturisticSection = () => {
    futuristicSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    {
      icon: <FaBolt className="text-3xl sm:text-4xl text-yellow-400" />,
      title: "Fast Charging",
      description: "Quick and efficient charging for your vehicle"
    },
    {
      icon: <FaChargingStation className="text-3xl sm:text-4xl text-green-400" />,
      title: "Wide Network",
      description: "Access to charging stations nationwide"
    },
    {
      icon: <FaClock className="text-3xl sm:text-4xl text-blue-400" />,
      title: "24/7 Availability",
      description: "Charging stations available round the clock"
    },
    {
      icon: <FaMapMarkedAlt className="text-3xl sm:text-4xl text-purple-400" />,
      title: "Easy Location",
      description: "Find nearest stations with our smart map"
    }
  ];

  if (showIntro) {
    return <IntroSlider onComplete={handleIntroComplete} />;
  }

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Navbar */}
      <nav className="py-4 sm:py-6 px-4 sm:px-6 md:px-10 flex justify-between items-center border-b border-gray-800/50 fixed top-0 left-0 right-0 z-[500] bg-black/90 backdrop-blur-sm">
        <Navbar />
      </nav>

      {/* Hero Section */}
      <CarSlider scrollToSection={scrollToFuturisticSection} />

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-8 sm:mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              Why Choose{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
                VOLTHUB
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
              Experience the future of electric vehicle charging with our innovative solutions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="p-4 sm:p-6 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 
                  border border-gray-700 hover:border-gray-600 transition-all duration-300
                  backdrop-blur-sm group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="mb-3 sm:mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Futuristic Vehicle Section */}
      <div ref={futuristicSectionRef}>
        <FuturisticVehicleSlider />
      </div>

      {/* Mission Section */}
      <VolthubMission />

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-green-500/10" />
        <motion.div 
          className="max-w-4xl mx-auto text-center relative z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
            Ready to Start Your Electric Journey?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8">
            Join thousands of satisfied customers who have made the switch to sustainable mobility
          </p>
          <motion.button
            onClick={() => navigate('/stations')}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-green-500 rounded-full
              text-base sm:text-lg font-semibold hover:shadow-lg hover:shadow-green-500/20 
              transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Find Charging Stations
          </motion.button>
        </motion.div>
      </section>

      {/* Show Intro Button */}
      <motion.button
        onClick={() => setShowIntro(true)}
        className="fixed bottom-4 sm:bottom-8 left-4 sm:left-8 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 
          text-white rounded-full shadow-lg flex items-center gap-2 z-50 text-sm sm:text-base"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg 
          className="w-4 h-4 sm:w-5 sm:h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" 
          />
        </svg>
        Show Intro
      </motion.button>

      <Footer />
      <ToastContainer />
    </div>
  );
};

export default Home;
