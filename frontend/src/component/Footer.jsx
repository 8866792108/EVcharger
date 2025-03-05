import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaBolt,
  FaCar,
  FaChargingStation
} from 'react-icons/fa';

const Footer = () => {
  const quickLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Find Stations', path: '/stations' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' }
  ];

  const services = [
    { name: 'Fast Charging', icon: <FaBolt /> },
    { name: 'Vehicle Support', icon: <FaCar /> },
    { name: '24/7 Stations', icon: <FaChargingStation /> }
  ];

  const contactInfo = [
    { icon: <FaPhoneAlt />, info: '+1 (555) 123-4567', href: 'tel:+15551234567' },
    { icon: <FaEnvelope />, info: 'support@volthub.com', href: 'mailto:support@volthub.com' },
    { icon: <FaMapMarkerAlt />, info: '123 EV Street, Tech City, 12345' }
  ];

  const socialLinks = [
    { icon: <FaFacebookF />, href: '#', color: 'hover:bg-blue-600' },
    { icon: <FaTwitter />, href: '#', color: 'hover:bg-blue-400' },
    { icon: <FaInstagram />, href: '#', color: 'hover:bg-pink-600' },
    { icon: <FaLinkedinIn />, href: '#', color: 'hover:bg-blue-700' }
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              VOLTHUB
            </h3>
            <p className="text-gray-400 text-sm">
              Powering the future of sustainable mobility with innovative charging solutions.
            </p>
            {/* Social Links */}
            <div className="flex space-x-4 pt-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className={`w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center
                    transition-all duration-300 ${social.color}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2"
                  >
                    <span className="h-px w-4 bg-gray-700 transition-all duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold">Our Services</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-300">
                  <span className="text-green-400">{service.icon}</span>
                  {service.name}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <ul className="space-y-3">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <span className="text-green-400">{item.icon}</span>
                  {item.href ? (
                    <a 
                      href={item.href}
                      className="text-gray-400 hover:text-white transition-colors duration-300"
                    >
                      {item.info}
                    </a>
                  ) : (
                    <span className="text-gray-400">{item.info}</span>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} VOLTHUB. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
