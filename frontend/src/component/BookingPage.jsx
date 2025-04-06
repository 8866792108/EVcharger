import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { slotmoney } from '../assets/utility';

const BookingPage = ({ url }) => {
  const { slotId } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [stationDetails, setStationDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(selectedBranch, selectedTimeSlots, selectedDate)
  }, [selectedBranch, selectedTimeSlots, selectedDate])

  // Define branches
  const branches = [
    { id: 'A1', label: 'Branch A1' },
    { id: 'A2', label: 'Branch A2' },
    { id: 'A3', label: 'Branch A3' },
    { id: 'A4', label: 'Branch A4' },
    { id: 'B1', label: 'Branch B1' },
    { id: 'B2', label: 'Branch B2' },
    { id: 'B3', label: 'Branch B3' },
    { id: 'B4', label: 'Branch B4' },
  ];

  useEffect(() => {
    const fetchStationDetails = async () => {
      try {
        const response = await axios.get(`${url}/slots/find/${slotId}`);
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
    if (!selectedDate || !selectedBranch) return;

    try {
      const response = await axios.post(`${url}/orders/api/available-slots`, {
        slotId,
        branchId: selectedBranch,
        date: selectedDate
      });

      setAvailableSlots(response.data.slots || []);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      toast.error('Error loading available slots');
    }
  };

  useEffect(() => {
    if (selectedDate && selectedBranch) {
      fetchAvailableSlots();
    }
  }, [selectedDate, selectedBranch]);

  const handleTimeSlotClick = (slot) => {
    if (!slot.available) return;

    setSelectedTimeSlots(prev => {
      const isSelected = prev.some(
        selected => selected.start === slot.start && selected.end === slot.end
      );

      if (isSelected) {
        return prev.filter(
          selected => !(selected.start === slot.start && selected.end === slot.end)
        );
      } else {
        return [...prev, slot];
      }
    });
  };

  const calculatePrice = (selectedSlots) => {
    const pricePerSlot = slotmoney
    return selectedSlots.length * pricePerSlot;
  };

  function isPastDate(dateString) {
    const givenDate = new Date(dateString);
    const currentDate = new Date();

    // Convert currentDate to "YYYY-MM-DD" format for accurate comparison
    const formattedCurrentDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );

    // Convert givenDate to "YYYY-MM-DD" format for accurate comparison
    const formattedGivenDate = new Date(
      givenDate.getFullYear(),
      givenDate.getMonth(),
      givenDate.getDate()
    );

    return formattedGivenDate < formattedCurrentDate;
  }

  const handleProceedToPayment = () => {
    if (!selectedDate || !selectedBranch || selectedTimeSlots.length === 0) {
      toast.error('Please select date, branch, and at least one time slot');
      return;
    }

    const ispast = isPastDate(selectedDate)

    if (ispast) {
      return toast.error("Not Select to the Past Date", {
        position: "top-center",
        autoClose: 2000,
      })
    }

    if (!localStorage.getItem("token")) {
      setTimeout(() => {
        toast.error("Please log in first to book a slot. ", {
          position: "top-center",
          autoClose: 2000,
        })
      }, 500);
      return navigate("/login")
    }

    // Convert 12-hour format to 24-hour format for correct sorting
    const convertTo24Hour = (time) => {
      let [hours, minutes] = time.split(/[: ]/);
      let period = time.slice(-2);

      if (period === "PM" && hours !== "12") hours = String(+hours + 12);
      if (period === "AM" && hours === "12") hours = "00";

      return `${hours}:${minutes}`;
    };

    // Sort selected time slots by start time
    const sortedSlots = [...selectedTimeSlots].sort((a, b) => {
      return convertTo24Hour(a.start).localeCompare(convertTo24Hour(b.start));
    });

    navigate(`/slotId/date/branchId/slots/payment`, { state: { slots: sortedSlots, branchId: selectedBranch, date: selectedDate, slotId: slotId } });
  };

  // Reset selected time slots when date or branch changes
  useEffect(() => {
    setSelectedTimeSlots([]);
    setAvailableSlots([]);
  }, [selectedDate, selectedBranch]);

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
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8">
        {/* Station Details */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6 lg:mb-8 border border-gray-800"
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 md:mb-4">{stationDetails?.name}</h1>
          <p className="text-gray-400 flex items-center text-sm">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            {stationDetails?.address}
          </p>
        </motion.div>

        {/* Main Booking Area */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {/* Left Side - Branch Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-4 lg:col-span-3"
          >
            <div className="bg-gray-900 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-gray-800 md:sticky md:top-8">
              <h2 className=" sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4 md:mb-6">Select Branch</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-1 gap-2 sm:gap-3">
                {branches.map((branch) => (
                  <motion.button
                    key={branch.id}
                    onClick={() => setSelectedBranch(branch.id)}
                    className={`p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl text-xs sm:text-sm  transition-all ${selectedBranch === branch.id
                      ? 'bg-gradient-to-r from-blue-500 to-green-500 border-transparent'
                      : 'bg-gray-800 border border-gray-700 hover:border-blue-500'
                      }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {branch.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Side - Date and Time Slots */}
          <div className="md:col-span-8 lg:col-span-9 space-y-3 sm:space-y-4 md:space-y-6">
            {/* Date Selection */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-900 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-gray-800"
            >
              <h2 className=" sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 md:mb-4 flex items-center">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Select Date
              </h2>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full date-icon bg-gray-800 border border-gray-700 rounded-lg sm:rounded-xl p-2 sm:p-3 text-xs sm:text-sm  text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </motion.div>

            {/* Available Time Slots */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedDate}-${selectedBranch}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gray-900 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-gray-800"
              >
                <h2 className=" sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4 md:mb-6">Available Time Slots</h2>
                {selectedDate && selectedBranch ? (
                  <motion.div
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.05
                        }
                      }
                    }}
                  >
                    {availableSlots.map((slot) => (
                      <motion.button
                        key={`${slot.start}-${slot.end}`}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 }
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleTimeSlotClick(slot)}
                        disabled={!slot.available}
                        className={`
                          p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm transition-all
                          ${!slot.available
                            ? 'bg-red-900/50 text-red-300 cursor-not-allowed'
                            : selectedTimeSlots.some(
                              selected => selected.start === slot.start && selected.end === slot.end
                            )
                              ? 'bg-gradient-to-r from-blue-500 to-green-500'
                              : 'bg-gray-800 hover:bg-gray-700'
                          }
                        `}
                      >
                        {slot.start} - {slot.end}
                      </motion.button>
                    ))}
                  </motion.div>
                ) : (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-gray-400 text-center py-4 sm:py-6 md:py-8 text-xs sm:text-sm "
                  >
                    Please select date and branch to view available slots
                  </motion.p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Booking Summary */}
        <AnimatePresence>
          {selectedDate && selectedBranch && selectedTimeSlots.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-3 sm:mt-4 md:mt-6 lg:mt-8 bg-gray-900 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-gray-800"
            >
              <h2 className=" sm:text-lg md:text-xl font-semibold mb-2 sm:mb-3 md:mb-4">Booking Summary</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm mb-1">Date</p>
                  <p className="font-medium text-xs sm:text-sm ">{selectedDate}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm mb-1">Branch</p>
                  <p className="font-medium text-xs sm:text-sm ">{selectedBranch}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm mb-1">Selected Slots</p>
                  <p className="font-medium text-xs sm:text-sm ">{selectedTimeSlots.length} slots</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm mb-1">Total Price</p>
                  <p className="font-medium text-xs sm:text-sm ">₹{calculatePrice(selectedTimeSlots)}</p>
                </div>
              </div>
              <motion.div
                className="mt-3 sm:mt-4 md:mt-6 flex justify-end"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  onClick={handleProceedToPayment}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-green-500 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl
                    font-semibold text-xs sm:text-sm  hover:opacity-90 transition-opacity"
                >
                  Proceed to Payment
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <ToastContainer />
    </div>
  );
};

export default BookingPage;