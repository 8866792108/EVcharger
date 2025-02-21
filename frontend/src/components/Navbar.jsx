import { useState, useEffect } from "react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // Change color after 50px scroll
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-10 left-0 w-full z-50 transition-colors rounded-full duration-500 ${isScrolled ? "bg-black" : "bg-transparent"
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
          <button className=" button-75 border-2 border-white text-white px-4 py-2 rounded-full hover:bg-white hover:text-black transition">
            Explore
          </button>
          <button className=" button-74 bg-green-500 px-4 py-2 rounded-full text-white hover:bg-green-600 transition">
            Contact Us
          </button>
          {localStorage.getItem('token')
            ? <img class="inline-block size-12 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""></img>
            : <button className=" button-74 bg-green-500 px-4 py-2 rounded-full text-white hover:bg-green-600 transition">
              login
            </button>
          }
        </div>
      </div>
    </nav>
  );
};

export default Navbar;