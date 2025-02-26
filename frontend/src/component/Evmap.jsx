import React, { useState, useEffect } from "react";
import {
  MapPin,
  Clock,
  Calendar,
  Zap,
  AlertCircle,
  X,
  CreditCard
} from "lucide-react";
import Maps from "./Maps";
import axios from "axios";

function Evmap() {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [interval, setInterval] = useState("30");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTimeSlotsModal, setShowTimeSlotsModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    amount: 25.0 // Default amount
  });

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setError(null);
        setLoading(true);

        try {
          const response = await axios.get(
            "http://localhost:8080/slots/getitems"
          );

          if (response.data.success) {
            setSlots(response.data.data);
          } else {
            console.error("Failed to fetch stops");
          }
        } catch (apiError) {
          console.log("Using mock data as backend is not available");
        }
      } catch (error) {
        console.error("Error fetching slots:", error);
        setError("Unable to load charging stations.");
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 grid md:grid-cols-[350px_1fr] gap-4 h-screen">
        {/* Sidebar - Charging Stations */}
        <div className="bg-white rounded-xl shadow-sm border border-indigo-100 overflow-y-scroll relative z-10">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Available Locations
            </h2>
          </div>
          <div className="p-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
                <p className="text-red-600 font-medium mb-2">
                  Error Loading Stations
                </p>
                <p className="text-sm text-gray-500">{error}</p>
              </div>
            ) : slots.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No charging stations available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {slots.map((slot) => (
                  <div
                    key={slot._id}
                    className="p-4 rounded-lg cursor-pointer transition-all transform hover:scale-[1.02] border-2 border-transparent hover:border-indigo-500 hover:bg-indigo-50"
                  >
                    <div className="space-y-4">
                      <img
                        src={
                          "http://localhost:8080/" + slot.image ||
                          "https://images.unsplash.com/photo-1697650786218-65a29882e9c1?auto=format&fit=crop&w=800&q=80"
                        }
                        alt={slot.name}
                        className="w-full h-48 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {slot.name}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          {slot.address}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                          <Clock className="w-4 h-4 mr-1" />
                          {slot.start} - {slot.end}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Map Section */}
        <div className="w-full h-full relative">
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 w-full h-full overflow-hidden relative z-0">
            <Maps />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Evmap;
