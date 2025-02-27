import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";
import ResponsiveSidebar from "./ResponsiveSidebar";
import CarSlider from "./Slider";
import Footer from "./Footer";
import FuturisticVehicleSlider from "./FuturisticVehicleSlider";
import VolthubMission from "./VolthubMission";

const Home = () => {
  const [loggedUser, setLoggedUser] = useState(localStorage.getItem("loggeduser") || "");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Reference to the FuturisticVehicleSlider section
  const futuristicSectionRef = useRef(null);

  // Function to scroll to the FuturisticVehicleSlider
  const scrollToFuturisticSection = () => {
    if (futuristicSectionRef.current) {
      futuristicSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Function to scroll back to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    document.body.classList.add("bg-black", "m-0", "p-0");
    
    const fetchProducts = async () => {
      try {
        const url = "http://localhost:8080/products/";
        const headers = {
          Authorization: localStorage.getItem("token"),
          Accept: "application/json",
        };

        const response = await fetch(url, { headers });
        if (!response.ok) throw new Error("Failed to fetch products");

        const result = await response.json();
        setProducts(result);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      document.body.classList.remove("bg-black", "m-0", "p-0");
    };
  }, []);

  return (
    <div className="bg-black min-h-screen text-white dark:text-gray-500">
      <main>
        <ResponsiveSidebar />
        <CarSlider scrollToSection={scrollToFuturisticSection} />
        <VolthubMission />

        {/* Loading State for Products */}
        <section className="py-12 px-10 bg-white text-black font-montserrat">
          <div className="container mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row items-start justify-between">
              <h2 className="text-4xl font-bold md:w-1/2 leading-snug">
                Explore Our Range of Electric Bikes
              </h2>
              <p className="text-base md:w-1/2 leading-relaxed">
                Discover the perfect electric bike for your needs. At VOLTHUB, we offer a diverse selection of 
                electric vehicles, each designed to provide a seamless and efficient ride. Whether you’re commuting 
                or exploring, our bikes are equipped to enhance your journey.
              </p>
            </div>
            <div className="mt-10 flex flex-col md:flex-row justify-between">
              <div className="md:w-1/2">
                <h3 className="text-lg font-semibold">Eco-Friendly</h3>
                <p className="text-sm mt-2">
                  Our bikes are designed to reduce carbon footprint while providing a smooth ride.
                </p>
              </div>
              <div className="md:w-1/2">
                <h3 className="text-lg font-semibold">Advanced Tech</h3>
                <p className="text-sm mt-2">
                  Equipped with the latest navigation and battery technology for optimal performance.
                </p>
              </div>
            </div>

            {/* Styled Contact Us Button */}
            <div className="mt-6 flex justify-center">
              <StyledButton>Contact Us</StyledButton>
            </div>
          </div>
        </section>

        {/* Futuristic Section */}
        <div ref={futuristicSectionRef}>
          <FuturisticVehicleSlider />
        </div>

        {/* Back to Top Button */}
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 bg-blue-200 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          🔝
        </button>

        <Footer />
      </main>
      <ToastContainer />
    </div>
  );
};

// Styled Components
const StyledButton = styled.button`
  background-color: #22c55e; /* Same green as Contact Us button */
  color: white;
  border-radius: 10em;
  font-size: 14px;
  font-weight: 600;
  padding: 0.8em 1.6em;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  border: none;
  box-shadow: 0 0 0 0 #1e9e4a;

  &:hover {
    background-color: #1e9e4a; /* Darker green on hover */
    transform: translateY(-4px) translateX(-2px);
    box-shadow: 2px 5px 0 0 #166534;
  }

  &:active {
    transform: translateY(2px) translateX(1px);
    box-shadow: 0 0 0 0 #166534;
  }
`;

export default Home;
