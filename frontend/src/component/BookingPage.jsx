import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar';

const BookingPage = () => {
  const { slotId } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlotNumber, setSelectedSlotNumber] = useState(null);
  const [stationDetails, setStationDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Duration options in minutes
  const durationOptions = [
    { label: "30 Minutes", value: 30 },
    { label: "1 Hour", value: 60 },
    { label: "2 Hours", value: 120 },
    { label: "3 Hours", value: 180 },
  ];

  useEffect(() => {
    const fetchStationDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/slots/find/${slotId}`);
        setStationDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching station details:', error);
        toast.error('Error loading station details');
        setLoading(false);
      }
    };
    fetchStationDetails();
  }, [slotId]);

  const fetchAvailableSlots = async () => {
    if (!selectedDate || !selectedTime || !selectedDuration) return;

    try {
      const response = await axios.post('http://localhost:8080/orders/api/available-slots', {
        slotId,
        startTime: '06:00 AM', // Station opening time
        endTime: '22:00 PM',   // Station closing time
        interval: 30,          // 30-minute intervals
        date: selectedDate
      });

      setAvailableSlots(response.data.slots || []);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      toast.error('Error loading available slots');
    }
  };

  useEffect(() => {
    if (selectedDate && selectedTime && selectedDuration) {
      fetchAvailableSlots();
    }
  }, [selectedDate, selectedTime, selectedDuration]);

  const handleProceedToPayment = () => {
    if (!selectedDate || !selectedTime || !selectedDuration || !selectedSlotNumber) {
      toast.error('Please select all booking details');
      return;
    }

    navigate(`/${slotId}/${selectedDate}/${selectedTime}/${selectedDuration}/${selectedSlotNumber}/payment`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="flex justify-center items-center h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Station Details */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-8 border border-gray-800">
          <h1 className="text-3xl font-bold mb-4">{stationDetails?.name}</h1>
          <p className="text-gray-400 flex items-center mb-2">
            <MapPin className="w-5 h-5 mr-2" />
            {stationDetails?.address}
          </p>
        </div>

        {/* Booking Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Date Selection */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Select Date
              </h2>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
              />
            </div>

            {/* Time Selection */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Select Time
              </h2>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white"
              />
            </div>

            {/* Duration Selection */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h2 className="text-xl font-semibold mb-4">Select Duration</h2>
              <div className="grid grid-cols-2 gap-3">
                {durationOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedDuration(option.value)}
                    className={`p-4 rounded-xl border transition-all ${
                      selectedDuration === option.value
                        ? 'bg-gradient-to-r from-blue-500 to-green-500 border-transparent'
                        : 'bg-gray-800 border-gray-700 hover:border-blue-500'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Available Slots */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h2 className="text-xl font-semibold mb-4">Available Slots</h2>
            {selectedDate && selectedTime && selectedDuration ? (
              <div className="grid grid-cols-4 gap-3">
                {availableSlots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSlotNumber(slot.number)}
                    disabled={!slot.available}
                    className={`
                      p-4 rounded-xl font-medium text-sm
                      ${
                        !slot.available
                          ? 'bg-red-900/50 text-red-300 cursor-not-allowed'
                          : slot.number === selectedSlotNumber
                          ? 'bg-gradient-to-r from-blue-500 to-green-500'
                          : 'bg-gray-800 hover:bg-gray-700'
                      }
                    `}
                  >
                    {slot.number}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">
                Please select date, time, and duration to view available slots
              </p>
            )}
          </div>
        </div>

        {/* Booking Summary */}
        {selectedDate && selectedTime && selectedDuration && selectedSlotNumber && (
          <div className="mt-8 bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-gray-400">Date</p>
                <p className="font-medium">{selectedDate}</p>
              </div>
              <div>
                <p className="text-gray-400">Time</p>
                <p className="font-medium">{selectedTime}</p>
              </div>
              <div>
                <p className="text-gray-400">Duration</p>
                <p className="font-medium">{selectedDuration} minutes</p>
              </div>
              <div>
                <p className="text-gray-400">Slot Number</p>
                <p className="font-medium">{selectedSlotNumber}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleProceedToPayment}
                className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;