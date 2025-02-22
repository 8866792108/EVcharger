import { useState, useEffect } from "react";

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
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
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
        <div className="flex space-x-4">
          <button className="button-75 border-2 border-white text-white px-4 py-2 rounded-full hover:bg-white hover:text-black transition">
            Explore
          </button>
          <button className="button-74 bg-green-500 px-4 py-2 rounded-full text-white hover:bg-green-600 transition">
            Contact Us
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
