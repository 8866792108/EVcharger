import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    // Navigation items used for both desktop and mobile
    const navItems = [
        { name: "Home", href: "/home" },
        { name: "About Us", href: "/AboutUs" },
        { name: "Stations", href: "/stations" },
        { name: "Blog", href: "/blog" },
        { name: "Contact", href: "/contact" }
    ];

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(prev => !prev);
    };

    const handleLogout = () => {
        // Clear user data and navigate to login page
        localStorage.removeItem("email");
        localStorage.removeItem("image");
        localStorage.removeItem("name");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/login");
    };

    // Ref for profile dropdown container
    const profileDropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                profileDropdownRef.current &&
                !profileDropdownRef.current.contains(event.target)
            ) {
                setIsProfileDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            {/* Logo Section */}
            <div className="flex items-center">
                <LogoText>VOLTHUB</LogoText>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
                {navItems.map(item => (
                    <NavLink key={item.name} to={item.href}>
                        <NavLinks>{item.name}</NavLinks>
                    </NavLink>
                ))}
            </div>

            {/* Auth/Profile Section */}
            <div className="flex items-center space-x-4">
                {!localStorage.getItem("email") ? (
                    <>
                        <NavButton className="bg-transparent border border-blue-500" onClick={() => navigate("/login")}>
                            Login
                        </NavButton>
                        <NavButton className="bg-blue-500 hover:bg-blue-600" onClick={() => navigate("/signup")}>
                            Register
                        </NavButton>
                    </>
                ) : (
                    <div className="relative" ref={profileDropdownRef}>
                        <div
                            className="w-12 h-12 flex items-center justify-center border-2 border-white rounded-full overflow-hidden transition hover:bg-white hover:text-black cursor-pointer"
                            onClick={() => setIsProfileDropdownOpen(prev => !prev)}
                        >
                            <img
                                src={
                                    localStorage.getItem("image") ||
                                    "https://th.bing.com/th/id/OIP.Z90mcRJHpvhKKhoFsy_2rwHaHa?pid=ImgDet&w=185&h=185&c=7&dpr=1.3"
                                }
                                alt="Profile"
                                className="w-10 h-10 object-cover rounded-full"
                            />
                        </div>
                        {isProfileDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-gray-950 shadow-lg rounded">
                                <ul className="py-2">
                                    <li
                                        className="px-4 py-2 hover:bg-gray-800 cursor-pointer"
                                        onClick={() => { setIsProfileDropdownOpen(false); navigate("/orders"); }}
                                    >
                                        View Orders
                                    </li>
                                    <li
                                        className="px-4 py-2 hover:bg-gray-800 cursor-pointer"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Hamburger Menu for Mobile */}
            <div className="md:hidden">
                <button onClick={toggleMobileMenu}>
                    {isMobileMenuOpen ? <FaTimes className="text-white" size={24} /> : <FaBars className="text-white" size={24} />}
                </button>
            </div>

            {/* Mobile Navigation Dropdown */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-black md:hidden flex flex-col items-center space-y-4 py-4 border-t border-gray-800">
                    {navItems.map(item => (
                        <NavLink key={item.name} to={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                            <NavLinks>{item.name}</NavLinks>
                        </NavLink>
                    ))}
                </div>
            )}
        </>
    );
};

// Styled Components
const LogoText = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(90deg, #3b82f6, #22c55e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 1px;
`;

const NavLinks = styled.a`
  color: #f3f4f6;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -4px;
    left: 0;
    background: linear-gradient(90deg, #3b82f6, #22c55e);
    transition: width 0.3s ease;
  }
  
  &:hover {
    color: #22c55e;
    
    &:after {
      width: 100%;
    }
  }
`;

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
