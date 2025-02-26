import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    // Set initial state based on scroll position
    setIsScrolled(window.scrollY > 50);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-10 left-1/2 transform -translate-x-1/2 w-2/3 z-50 transition-colors duration-500 rounded-full ${
        isScrolled ? "bg-black shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center py-3 px-6">
        {/* Logo */}
        <div className="text-white text-2xl font-semibold">VOLTHUB</div>

        {/* Navigation Links */}
        <ul className="hidden md:flex space-x-6 text-white">
          <li className="cursor-pointer hover:opacity-80">About Us</li>
          <li className="cursor-pointer hover:opacity-80">Supported Vehicles</li>
          <li className="cursor-pointer hover:opacity-80">Contact Us</li>
          <li className="cursor-pointer hover:opacity-80">FAQ</li>
        </ul>

        {/* Buttons */}
        <div className="flex space-x-4 items-center">
          {!localStorage.getItem("email") ? (
            <NavLink
              to={"/login"}
              className="border-2 border-white text-white px-4 py-2 text-sm rounded-full hover:bg-white hover:text-black transition"
            >
              Login
            </NavLink>
          ) : (
            <div className="w-12 h-12 flex items-center justify-center border-2 border-white rounded-full overflow-hidden hover:bg-white hover:text-black transition">
              <img
                src={
                  localStorage.getItem("image") ||
                  "https://th.bing.com/th/id/OIP.Z90mcRJHpvhKKhoFsy_2rwHaHa?pid=ImgDet&w=185&h=185&c=7&dpr=1.3"
                }
                alt="Profile"
                className="w-10 h-10 object-cover rounded-full"
              />
            </div>
          )}

          {/* Styled Contact Us Button */}
          <StyledButton>Contact Us</StyledButton>
        </div>
      </div>
    </nav>
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
    box-shadow: 0 0 0 0rgb(0, 0, 0);
  }
`;

export default Navbar;
