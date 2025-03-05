"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { MapPin, Clock, Calendar, Navigation, Search, X, MapIcon } from "lucide-react"
import axios from "axios"
import styled from "styled-components"
import { motion } from "framer-motion"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import CarRental from "./filter"
import Navbar from "./Navbar"

const Evmap = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [slots, setSlots] = useState([])
  const [filteredSlots, setFilteredSlots] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showBookingPopup, setShowBookingPopup] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [selectedDuration, setSelectedDuration] = useState(null)
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const bookingDetails = location.state
  const [availableSlots] = useState([
    { id: 1, number: "A1", status: "available" },
    { id: 2, number: "A2", status: "booked" },
    { id: 3, number: "A3", status: "available" },
    { id: 4, number: "A4", status: "booked" },
    { id: 5, number: "B1", status: "available" },
    { id: 6, number: "B2", status: "booked" },
    { id: 7, number: "B3", status: "available" },
    { id: 8, number: "B4", status: "booked" },
  ])
  const [selectedSlotNumber, setSelectedSlotNumber] = useState(null)
  const [selectedVehicleType, setSelectedVehicleType] = useState('all')
  const [userLocation, setUserLocation] = useState(null)
  const [isNearMeActive, setIsNearMeActive] = useState(false)

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setError(null)
        setLoading(true)
        const response = await axios.get("http://localhost:8080/slots/getitems")
        if (response.data.success) {
          setSlots(response.data.data)
          setFilteredSlots(response.data.data)
        } else {
          console.error("Failed to fetch slots")
        }
      } catch (error) {
        console.error("Error fetching slots:", error)
        setError(
          "Unable to load charging stations. Please ensure the backend server is running at http://localhost:8080",
        )
      } finally {
        setLoading(false)
      }
    }
    fetchSlots()
  }, [])

  useEffect(() => {
    let filtered = slots

    // Filter by search term
    filtered = filtered.filter(slot =>
      slot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      slot.address.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Filter by vehicle type
    if (selectedVehicleType !== 'all') {
      if (['bicycle', 'autorickshaw'].includes(selectedVehicleType)) {
        setFilteredSlots([])
        return
      }

      const vehicleTypeMap = {
        'bike': ['ola', 'ather', 'tvs', 'bajaj', 'hero', 'rorr'],
        'car': ['smc'],
        'tesla': ['tesla']
      }

      const allowedBrands = vehicleTypeMap[selectedVehicleType] || []
      filtered = filtered.filter(slot =>
        allowedBrands.some(brand => slot.name.toLowerCase().includes(brand.toLowerCase()))
      )
    }

    // Filter by location if Near Me is active
    if (isNearMeActive && userLocation) {
      filtered = filtered
        .map(slot => ({
          ...slot,
          distance: calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            slot.latitude,
            slot.longitude
          )
        }))
        .filter(slot => slot.distance <= 10) // Show stations within 10km
        .sort((a, b) => a.distance - b.distance)
    }

    setFilteredSlots(filtered)
  }, [searchTerm, selectedVehicleType, slots, isNearMeActive, userLocation])

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot)
    setShowBookingPopup(true)
    setSelectedDuration(null)
    setStartTime("")
    setEndTime("")
  }

  const handleSlotSelection = (slot) => {
    if (slot.status === "available") {
      setSelectedSlotNumber(slot.number)
    }
  }

  // Duration options in minutes
  const durationOptions = [
    { label: "30 Minutes", value: 30 },
    { label: "1 Hour", value: 60 },
    { label: "2 Hours", value: 120 },
    { label: "3 Hours", value: 180 },
  ]

  // Function to calculate end time based on start time and duration
  const calculateEndTime = (start, durationInMinutes) => {
    if (!start) return ""
    const [hours, minutes] = start.split(":")
    const startDate = new Date()
    startDate.setHours(Number.parseInt(hours))
    startDate.setMinutes(Number.parseInt(minutes))

    const endDate = new Date(startDate.getTime() + durationInMinutes * 60000)
    return `${endDate.getHours().toString().padStart(2, "0")}:${endDate.getMinutes().toString().padStart(2, "0")}`
  }

  // Function to handle duration selection
  const handleDurationSelect = (duration) => {
    setSelectedDuration(duration)
    if (!startTime) {
      // Set current time as start time if not selected
      const now = new Date()
      const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`
      setStartTime(currentTime)
      setEndTime(calculateEndTime(currentTime, duration))
    } else {
      setEndTime(calculateEndTime(startTime, duration))
    }
  }

  const handleStartTimeChange = (e) => {
    const newStartTime = e.target.value
    setStartTime(newStartTime)
    if (selectedDuration) {
      setEndTime(calculateEndTime(newStartTime, selectedDuration))
    }
  }

  const handleProceedToPayment = () => {
    if (!selectedDate || !startTime || !selectedDuration || !selectedSlotNumber) {
      toast.error("Please select date, time, duration and a slot", {
        position: "top-center",
        autoClose: 3000,
      })
      return
    }
    navigate("/payment", {
      state: {
        slotId: selectedSlot._id,
        slotNumber: selectedSlotNumber,
        stationName: selectedSlot.name,
        date: selectedDate,
        startTime: startTime,
        endTime: endTime,
        duration: selectedDuration,
        price: (selectedDuration / 30) * 10,
      },
    })
  }

  const handleNavigateToMaps = (address, name) => {

    const NewAdd = address.replaceAll(" ", "+")
    const NewName = name.replaceAll(" ", "+")
    console.log("new address :: " + NewName + NewAdd);

    const navigateUrl = `https://www.google.com/maps/dir/${userLocation.latitude},${userLocation.longitude}/${NewName},${NewAdd}`;

    window.open(navigateUrl, '_blank');
  }

  const handleFindNearMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords
        setUserLocation({ latitude, longitude })
        setIsNearMeActive(true)
        toast.success("Showing charging stations near you")
      }, (error) => {
        toast.error("Please enable location services to use this feature")
      })
    } else {
      toast.error("Geolocation is not supported by your browser")
    }
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords
        setUserLocation({ latitude, longitude })
      }, (error) => {
        toast.error("Please enable location services to use this feature")
      })
    } else {
      toast.error("Geolocation is not supported by your browser")
    }
  }, [])
  // Add this helper function to calculate distance
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // Distance in km
  }

  return (
    <div className="bg-black min-h-screen text-white flex flex-col">
      {/* Navbar */}
      <nav className="py-6 px-10 flex justify-between items-center border-b border-gray-800 fixed top-0 left-0 right-0 z-[500] bg-black">
        <Navbar />
      </nav>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-10 mt-20">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section with Background Image */}
          <div className="relative h-96 mb-16">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: 'url("https://i.pinimg.com/474x/a2/88/32/a28832bd28790cd14caaa00a3d92e04e.jpg")',
                filter: 'brightness(0.7)'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30" />
            <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
                Find Charging Stations
              </h1>
              <p className="text-xl text-gray-200 mb-8 max-w-2xl">
                Locate and book charging stations for your electric vehicle with ease
              </p>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="max-w-6xl mx-auto mb-10 px-4">
            <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                {/* Search Input */}
                <div className="relative flex-1 w-full">
                  <FuturisticInput
                    type="text"
                    placeholder="Search locations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                  <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>

                {/* Vehicle Type Filter */}
                <div className="flex gap-3 flex-wrap justify-center">
                  {[
                    { label: 'All', value: 'all' },
                    { label: 'Bikes', value: 'bike' },
                    { label: 'Cars', value: 'car' },
                    { label: 'Tesla', value: 'tesla' },
                    { label: 'Bicycle', value: 'bicycle' },
                    { label: 'Auto Rickshaw', value: 'autorickshaw' }
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => {
                        setSelectedVehicleType(type.value)
                        if (['tesla', 'bicycle', 'autorickshaw'].includes(type.value)) {
                          toast.info("Coming soon!", {
                            position: "top-center",
                            autoClose: 3000
                          })
                        }
                      }}
                      className={`px-4 py-2 rounded-full transition-all ${selectedVehicleType === type.value
                        ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>

                {/* Near Me Button */}
                <button
                  onClick={handleFindNearMe}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-full transition-all"
                >
                  <MapIcon size={20} />
                  <span>Near Me</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filter Section */}

          {/* Stations Grid */}
          <motion.div
            className="bg-gray-900 rounded-xl shadow-lg p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-400 font-medium text-lg mb-2">Error Loading Stations</p>
                <p className="text-gray-400">{error}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredSlots.map((slot) => (
                  <StationCard
                    key={slot._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -5 }}
                    className="w-full"
                  >
                    <div className="relative overflow-hidden rounded-t-xl h-64">
                      <img
                        src={"http://localhost:8080/" + slot.image || "/placeholder.svg?height=200&width=400"}
                        alt={slot.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-3">{slot.name}</h3>
                      <p className="text-gray-300 flex items-center mb-2">
                        <MapPin className="w-5 h-5 mr-2 text-blue-400" /> {slot.address}
                      </p>
                      {isNearMeActive && slot.distance && (
                        <p className="text-gray-300 flex items-center mb-2">
                          <MapPin className="w-5 h-5 mr-2 text-blue-400" />
                          {slot.distance.toFixed(1)} km away
                        </p>
                      )}
                      <p className="text-gray-300 flex items-center mb-4">
                        <Clock className="w-5 h-5 mr-2 text-blue-400" /> 8:30 AM - 8:30 PM
                      </p>

                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-4">
                        <FuturisticButton onClick={() => handleSlotSelect(slot)} className="flex-1">
                          <Calendar className="w-4 h-4 mr-2" />
                          Book Slot
                        </FuturisticButton>
                        <FuturisticButton
                          onClick={() => handleNavigateToMaps(slot.address, slot.name)}
                          className="flex-1"
                          $secondary
                        >
                          <Navigation className="w-4 h-4 mr-2" />
                          Navigate
                        </FuturisticButton>
                      </div>
                    </div>
                  </StationCard>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-10 border-t border-gray-800 text-center text-gray-500">
        <p>© 2024 VOLTHUB. All rights reserved.</p>
      </footer>

      {/* Booking Popup */}
      {showBookingPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            className="bg-gray-900 rounded-2xl p-8 shadow-2xl w-full max-w-md border border-gray-800"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-white">Book Your Slot</h2>
              <button
                onClick={() => setShowBookingPopup(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2 text-blue-400">{selectedSlot?.name}</h3>
              <p className="text-gray-300 flex items-center mb-2">
                <MapPin className="w-4 h-4 mr-2" /> {selectedSlot?.address}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Select Charging Slot</label>
              <div className="grid grid-cols-4 gap-3">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => handleSlotSelection(slot)}
                    disabled={slot.status === "booked"}
                    className={`
                      p-4 rounded-lg font-medium text-sm
                      ${slot.status === "booked"
                        ? "bg-red-900 text-red-300 cursor-not-allowed opacity-60"
                        : slot.number === selectedSlotNumber
                          ? "bg-gradient-to-r from-blue-500 to-green-500 text-white"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }
                      transition-colors duration-200
                    `}
                  >
                    {slot.number}
                  </button>
                ))}
              </div>
              <div className="flex gap-4 mt-3 text-sm text-gray-400">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-900 mr-2"></div>
                  <span>Booked</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Select Date
              </label>
              <FuturisticInput
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Start Time
              </label>
              <FuturisticInput type="time" value={startTime} onChange={handleStartTimeChange} />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Select Duration</label>
              <div className="grid grid-cols-2 gap-2">
                {durationOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleDurationSelect(option.value)}
                    className={`p-3 text-sm rounded-lg border ${selectedDuration === option.value
                      ? "bg-gradient-to-r from-blue-500 to-green-500 text-white border-transparent"
                      : "bg-gray-800 text-gray-300 border-gray-700 hover:border-blue-500"
                      }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {startTime && endTime && selectedSlotNumber && (
              <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                <h4 className="font-medium mb-2 text-white">Booking Summary</h4>
                <p className="text-sm text-gray-300">Slot Number: {selectedSlotNumber}</p>
                <p className="text-sm text-gray-300">Start: {startTime}</p>
                <p className="text-sm text-gray-300">End: {endTime}</p>
                <p className="text-sm font-medium text-blue-400 mt-2">Price: ${(selectedDuration / 30) * 10}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setShowBookingPopup(false)}
                className="flex-1 bg-gray-800 text-gray-300 py-3 rounded-xl hover:bg-gray-700 transition-colors duration-300 font-medium"
              >
                Cancel
              </button>
              <FuturisticButton
                onClick={handleProceedToPayment}
                className="flex-1"
                disabled={!selectedDate || !startTime || !selectedDuration || !selectedSlotNumber}
              >
                Proceed to Payment
              </FuturisticButton>
            </div>
          </motion.div>
        </div>
      )}

      <ToastContainer />
    </div>
  )
}

// Styled Components
const LogoText = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(90deg, #3b82f6, #22c55e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 1px;
`

const NavLink = styled.a`
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
`

const NavButton = styled.button`
  padding: 0.5rem 1.25rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.2);
  }
`

const FuturisticInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: rgba(17, 24, 39, 0.8);
  border: 1px solid #374151;
  border-radius: 0.375rem;
  color: white;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
  }
  
  &::placeholder {
    color: #6b7280;
  }
`

const FuturisticButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  background: ${(props) => (props.$secondary ? "transparent" : "linear-gradient(90deg, #3b82f6, #22c55e)")};
  border: ${(props) => (props.$secondary ? "1px solid #3b82f6" : "none")};
  border-radius: 0.375rem;
  color: white;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  opacity: ${(props) => (props.disabled ? "0.5" : "1")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: all 0.6s ease;
  }
  
  &:hover {
    transform: ${(props) => (props.disabled ? "none" : "translateY(-2px)")};
    box-shadow: ${(props) => (props.disabled ? "none" : "0 4px 12px rgba(34, 197, 94, 0.3)")};
    
    &:before {
      left: ${(props) => (props.disabled ? "-100%" : "100%")};
    }
  }
  
  &:active {
    transform: ${(props) => (props.disabled ? "none" : "translateY(1px)")};
  }
`

const FuturisticLine = styled.div`
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #22c55e);
  border-radius: 2px;
  position: relative;
  margin: 2rem auto;
  
  &:before, &:after {
    content: '';
    position: absolute;
    height: 4px;
    width: 10px;
    background: #22c55e;
    border-radius: 2px;
  }
  
  &:before {
    left: -15px;
  }
  
  &:after {
    right: -15px;
  }
`

const StationCard = styled(motion.div)`
  background-color: rgba(17, 24, 39, 0.8);
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid #2d3748;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.3);
  }
`

export default Evmap

