import { useState } from "react";

const CarRental = () => {
  return (
    <div className="relative h-screen w-full">
      {/* Full-Screen Background Image */}
      <img
        src="https://storage.googleapis.com/a1aa/image/-GQC_Czovm-6MhLX9zPZSVoBMcKdLRp_ezz0eLCll64.jpg"
        alt="Background image of a car on a road"
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex flex-col justify-between">
        {/* Filter Section Floating */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-11/12 bg-white p-6 rounded-lg shadow-lg max-w-4xl">
          <h2 className="text-xl font-bold mb-4">Available For Rent</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Choose Vehicle Type</label>
              <select className="mt-1 w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500">
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="truck">Truck</option>
                <option value="van">Van</option>
                <option value="convertible">Convertible</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Choose Category</label>
              <select className="mt-1 w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500">
                <option value="luxury">Luxury</option>
                <option value="economy">Economy</option>
                <option value="electric">Electric</option>
                <option value="sports">Sports</option>
              </select>
            </div>
            <div className="col-span-2 flex justify-center">
              <button className="w-full bg-black text-white py-2 px-4 rounded-md shadow-sm hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-orange-500" type="submit">
                FIND A CAR
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CarRental;