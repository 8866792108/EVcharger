import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import styled from "styled-components";
import { FaBars, FaTimes } from "react-icons/fa"; // Icons for the menu toggle

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-5 left-1/2 transform -translate-x-1/2 w-11/12 md:w-2/3 transition-all duration-500 rounded-full z-[1000] p-3 ${
        isScrolled || location.pathname === "/ordermanage" || location.pathname === "/map"
          ? "bg-black shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="flex justify-between items-center mx-auto">
        {/* Logo */}
        <NavLink to={'/home'} className="text-white text-2xl font-semibold">VOLTHUB</NavLink>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-6 text-white">
          <NavLink to="/home" className="cursor-pointer hover:opacity-80">
            home
          </NavLink>
          <NavLink to="/about" className="cursor-pointer hover:opacity-80">
            About Us
          </NavLink>
          <NavLink to="/map" className="cursor-pointer hover:opacity-80">
            map
          </NavLink>
          <NavLink to="/ordermanage" className="cursor-pointer hover:opacity-80">
            Vehicle Management
          </NavLink>
          <NavLink className="cursor-pointer hover:opacity-80">FAQ</NavLink>
        </ul>

        {/* Buttons & Profile */}
        <div className="hidden md:flex space-x-4 items-center">
          {!localStorage.getItem("email") ? (
            <NavLink
              to="/login"
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
          <NavLink to="/contactus">
            <StyledButton>Contact Us</StyledButton>
          </NavLink>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black shadow-md text-white text-center py-4 space-y-4 rounded-b-lg">
          <NavLink to="/about" className="block" onClick={() => setIsMenuOpen(false)}>
            About Us
          </NavLink>
          <NavLink to="/map" className="block" onClick={() => setIsMenuOpen(false)}>
            Supported Vehicles
          </NavLink>
          <NavLink to="/ordermanage" className="block" onClick={() => setIsMenuOpen(false)}>
            Contact Us
          </NavLink>
          <NavLink className="block" onClick={() => setIsMenuOpen(false)}>
            FAQ
          </NavLink>

          {/* Mobile Login/Profile */}
          {!localStorage.getItem("email") ? (
            <NavLink
              to="/login"
              className="border-2 border-white text-white px-4 py-2 text-sm rounded-full hover:bg-white hover:text-black transition block mx-auto w-1/2"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </NavLink>
          ) : (
            <div className="w-12 h-12 mx-auto flex items-center justify-center border-2 border-white rounded-full overflow-hidden hover:bg-white hover:text-black transition">
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

          <NavLink to="/contactus" onClick={() => setIsMenuOpen(false)}>
            <StyledButton>Contact Us</StyledButton>
          </NavLink>
        </div>
      )}
    </nav>
  );
};

// Styled Button
const StyledButton = styled.button`
  background-color: #22c55e;
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
    background-color: #1e9e4a;
    transform: translateY(-4px) translateX(-2px);
    box-shadow: 2px 5px 0 0 #166534;
  }

  &:active {
    transform: translateY(2px) translateX(1px);
    box-shadow: 0 0 0 0 rgb(0, 0, 0);
  }
`;

export default Navbar;
