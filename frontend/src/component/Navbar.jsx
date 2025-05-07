import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBolt, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import styled from 'styled-components';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const profileDropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showProfileMenu.current &&
        !showProfileMenu.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const navLinks = [
    { name: 'Home', path: '/home' },
    { name: 'Stations', path: '/stations' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    // Add your logout logic here
    localStorage.removeItem('userId')
    localStorage.removeItem('email')
    localStorage.removeItem('name')
    localStorage.removeItem('image')
    localStorage.removeItem('token')
    localStorage.removeItem('hasSeenIntro')
    navigate('/');
  };

  return (
    <nav className={`w-full ${isScrolled ? 'py-4' : 'py-6'} transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/home" className="flex items-center space-x-2">
          <FaBolt className="text-2xl text-green-400" />
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            VOLTHUB
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative text-sm font-medium transition-colors duration-300
                ${location.pathname === link.path ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            >
              {link.name}
              {location.pathname === link.path && (
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-green-400"
                  layoutId="navbar-indicator"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Profile and Mobile Menu Buttons */}
        <div className="flex items-center space-x-4">
          {/* Profile Menu */}

          {/* <div className="relative">
            <motion.button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaUser className="text-gray-300" />
            </motion.button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 py-2 bg-gray-800 rounded-xl shadow-xl z-50"
                >
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors duration-300"
                  >
                    Profile Settings
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors duration-300"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors duration-300 flex items-center space-x-2"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div> */}
          {!localStorage.getItem("email") ? (
            <div className="flex items-center space-x-4">
              <NavButton className="bg-transparent border border-blue-500" onClick={() => navigate("/login")}>
                Login
              </NavButton>
              <NavButton className="bg-blue-500 hover:bg-blue-600" onClick={() => navigate("/signup")}>
                Register
              </NavButton>
            </div>
          ) : (
            <div className="relative" ref={profileDropdownRef}>
              <motion.button
                // onClick={() => setShowProfileMenu(!showProfileMenu)}
                // className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-300"
                className="w-12 h-12 flex items-center justify-center border-2 border-white rounded-full overflow-hidden transition hover:bg-white hover:text-black cursor-pointer"
                onClick={() => setShowProfileMenu(prev => !prev)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {localStorage.getItem('image')
                  ? <img src={localStorage.getItem('image')} alt="" className="w-full h-full object-cover rounded-full" />
                  : <FaUser className="text-gray-300" />
                }
              </motion.button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-55 py-2 bg-gray-800 rounded-xl shadow-xl z-50"
                  >
                    {/* <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors duration-300"
                    >
                      Profile Settings
                    </Link> */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        
                        <div>
                          <p className="font-medium text-gray-300">
                            {localStorage.getItem("name") || "User"}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {localStorage.getItem("email") || "user@example.com"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors duration-300"
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors duration-300 flex items-center space-x-2"
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}


          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-800 mt-4 rounded-xl overflow-hidden"
          >
            <div className="px-4 py-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block py-3 text-sm transition-colors duration-300
                    ${location.pathname === link.path ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const NavButton = styled.button`
  padding: 0.5rem 1.25rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.2);
  }
`;
export default Navbar;
