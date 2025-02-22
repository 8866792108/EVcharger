import React from "react";
import img from "../assets/img/volthubmisson.jpg";

const VolthubMission = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-center bg-gray-100 py-12 px-6 md:px-20">
      {/* Image Section */}
      <div className="md:w-1/2 p-4">
        <img
          src={img} 
          alt="Electric Bike"
          className="rounded-2xl shadow-lg w-full object-cover"
        />
      </div>

      {/* Content Section */}
      <div className="md:w-1/2 p-4 text-gray-900 font-montserrat">
        <h2 className="text-3xl font-playfair font-bold mb-4">
          Discover VOLTHUB's Mission
        </h2>
        <p className="text-lg mb-6">
          At VOLTHUB, we are dedicated to navigating electric bikes to charging
          stations, ensuring a smooth experience for our users. Our mission is
          to empower electric vehicle users with easy access to charging
          solutions and a variety of bike options.
        </p>
        
        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-bold font-playfair">100 bikes</h3>
            <p className="text-sm">Electric bikes are becoming a popular choice for eco-conscious commuters.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold font-playfair">50 charging stations</h3>
            <p className="text-sm">We have established numerous charging stations for convenience.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold font-playfair">3 values</h3>
            <p className="text-sm">Sustainability, Innovation, and Customer Satisfaction drive us forward.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold font-playfair">3 team members</h3>
            <p className="text-sm">Our dedicated team ensures the best experience for our users.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VolthubMission;
