import { useState } from "react";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { FaInstagram, FaTwitter, FaFacebookF } from "react-icons/fa";

const Footer = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <footer className="bg-black text-white py-10">
      {/* Contact Section */}
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center border-b border-gray-700 pb-8">
        <div>
          <FaEnvelope className="text-yellow-400 text-2xl mx-auto" />
          <h3 className="text-lg font-semibold mt-2">Email Us</h3>
          <p className="text-sm text-gray-400">contact@volthub.com</p>
        </div>
        <div>
          <FaPhoneAlt className="text-yellow-400 text-2xl mx-auto" />
          <h3 className="text-lg font-semibold mt-2">Call Us</h3>
          <p className="text-sm text-gray-400">+1 (555) 123-4567</p>
        </div>
        <div>
          <FaMapMarkerAlt className="text-yellow-400 text-2xl mx-auto" />
          <h3 className="text-lg font-semibold mt-2">Visit Us</h3>
          <p className="text-sm text-gray-400">123 Electric Ave, San Francisco, CA</p>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="container mx-auto px-6 py-10 text-center">
        <h3 className="text-2xl font-semibold">Get Answers</h3>
        <p className="text-gray-500">Find the information you need about electric bikes and charging stations.</p>
        <div className="max-w-2xl mx-auto mt-4 text-left">
          {[
            "How do I charge my electric bike?",
            "What types of electric bikes do you support?",
            "Where can I find charging stations?",
          ].map((question, index) => (
            <div key={index} className="border-b border-gray-300 py-3">
              <button className="w-full text-left text-lg font-medium" onClick={() => toggleFAQ(index)}>
                {question}
              </button>
              {openIndex === index && <p className="text-gray-600 mt-2">Answer to the question goes here...</p>}
            </div>
          ))}
        </div>
        <button className="button-74 mt-4 bg-green-600 text-white rounded-full px-4 py-2 hover:bg-green-700 transition">
          View More FAQs
        </button>
      </div>
      
      {/* Bottom Footer */}
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-gray-400 border-t border-gray-700 pt-6">
        <p>&copy; 2025 VOLTHUB. All rights reserved.</p>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-white"><FaFacebookF /></a>
          <a href="#" className="hover:text-white"><FaInstagram /></a>
          <a href="#" className="hover:text-white"><FaTwitter /></a>
        </div>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-white">About Us</a>
          <a href="#" className="hover:text-white">Supported Vehicles</a>
          <a href="#" className="hover:text-white">Contact Us</a>
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms & Conditions</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
