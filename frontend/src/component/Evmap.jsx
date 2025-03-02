import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Clock } from "lucide-react";
import axios from "axios";
import CarRental from "./filter";
import Maps from "./Maps";

const Evmap = () => {
    const navigate = useNavigate();
    const [slots, setSlots] = useState([]);
    const [filteredSlots, setFilteredSlots] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showBookingPopup, setShowBookingPopup] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);

    useEffect(() => {
        const fetchSlots = async () => {
            try {
                setError(null);
                setLoading(true);
                const response = await axios.get("http://localhost:8080/slots/getitems");
                if (response.data.success) {
                    setSlots(response.data.data);
                    setFilteredSlots(response.data.data);
                } else {
                    console.error("Failed to fetch slots");
                }
            } catch (error) {
                console.error("Error fetching slots:", error);
                setError("Unable to load charging stations. Please ensure the backend server is running at http://localhost:8080");
            } finally {
                setLoading(false);
            }
        };
        fetchSlots();
    }, []);

    useEffect(() => {
        const filtered = slots.filter(slot =>
            slot.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredSlots(filtered);
    }, [searchTerm, slots]);

    const handleSlotSelect = slot => {
        setSelectedSlot(slot);
        setShowBookingPopup(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
            <CarRental />
            <div className="w-full" style={{ maxHeight: '100vh' }}>
                <div className="bg-white rounded-xl shadow-lg h-full">
                    <div className="p-4 bg-white border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Available Locations</h2>
                        <input
                            type="text"
                            placeholder="Search locations..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500"
                        />
                    </div>
                    <div className="p-4">
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : error ? (
                            <div className="text-center py-8">
                                <p className="text-red-600 font-medium mb-2">Error Loading Stations</p>
                                <p className="text-sm text-gray-500">{error}</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-cards gap-4">
                                {filteredSlots.map((slot) => (
                                    <div
                                        key={slot._id}
                                        onClick={() => handleSlotSelect(slot._id)}
                                        className="p-4 rounded-lg cursor-pointer transition-all transform hover:scale-[1.02] border-2 hover:border-indigo-500 hover:bg-indigo-50 shadow-md"
                                    >
                                        <img
                                            src={"http://localhost:8080/" + slot.image || "https://images.unsplash.com/photo-1697650786218-65a29882e9c1?auto=format&fit=crop&w=800&q=80"}
                                            alt={slot.name}
                                            className="w-full h-48 rounded-lg object-cover"
                                        />
                                        <h3 className="font-medium text-gray-900">{slot.name}</h3>
                                        <p className="text-sm text-gray-500 flex items-center mt-1">
                                            <MapPin className="w-4 h-4 mr-1" /> {slot.address}
                                        </p>
                                        <p className="text-sm text-gray-500 flex items-center mt-1">
                                            <Clock className="w-4 h-4 mr-1" /> 8:30 AM - 8:30 PM
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {showBookingPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2000]">
                    <div className="bg-white w-full max-w-md rounded-lg p-6 shadow-lg">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Your Parking Slot</h2>
                        <div className="grid grid-cols-5 gap-2">
                            {[...Array(8)].map((_, index) => (
                                <button
                                    key={index}
                                    className="w-12 h-12 bg-gray-200 rounded-md hover:bg-green-500 transition"
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowBookingPopup(false)}
                            className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md w-full hover:bg-red-600"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Evmap;
