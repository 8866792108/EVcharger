import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChargingStation, faTimes, faShare, faEllipsisH } from '@fortawesome/free-solid-svg-icons';

const VehicleStats = () => {
  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Charging Stations */}
        <div className="space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg border border-green-500">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faChargingStation} className="text-green-500 text-2xl" />
                <span className="text-gray-400 text-xl">1.5 miles</span>
              </div>
              <FontAwesomeIcon icon={faTimes} className="text-green-500" />
            </div>
            <div className="mt-2">
              <h2 className="text-white text-lg">Tesla Station</h2>
              <div className="flex justify-between text-gray-400 text-sm mt-1">
                <span>Type DC</span>
                <span>Price $0.6 kW</span>
                <span>Slot 5</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faChargingStation} className="text-green-500 text-2xl" />
                <span className="text-gray-400 text-xl">2.3 miles</span>
              </div>
              <FontAwesomeIcon icon={faShare} className="text-green-500" />
            </div>
            <div className="mt-2">
              <h2 className="text-white text-lg">Super Charger</h2>
              <div className="flex justify-between text-gray-400 text-sm mt-1">
                <span>Type DC</span>
                <span>Price $0.8 kW</span>
                <span>Slot 9</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faChargingStation} className="text-green-500 text-2xl" />
                <span className="text-gray-400 text-xl">3.1 miles</span>
              </div>
              <FontAwesomeIcon icon={faShare} className="text-green-500" />
            </div>
            <div className="mt-2">
              <h2 className="text-white text-lg">Super Charger</h2>
              <div className="flex justify-between text-gray-400 text-sm mt-1">
                <span>Type DC</span>
                <span>Price $0.8 kW</span>
                <span>Slot 9</span>
              </div>
            </div>
          </div>
        </div>
        {/* Vehicle Stats */}
        <div className="space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-white text-lg">Vehicle Stats</h2>
              <FontAwesomeIcon icon={faEllipsisH} className="text-gray-400" />
            </div>
            <div className="mt-4">
              <img alt="White Tesla car" className="w-full rounded-lg" src="https://placehold.co/400x200" />
            </div>
            <div className="mt-4 text-gray-400 text-sm">
              <div className="flex justify-between">
                <span>EV</span>
                <span className="text-white">Tesla</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Battery</span>
                <span className="text-green-500">80%</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Range</span>
                <span className="text-white">340 miles</span>
              </div>