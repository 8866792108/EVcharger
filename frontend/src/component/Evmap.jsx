"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation, NavLink, useParams } from "react-router-dom"
import { MapPin, Clock, Calendar, Navigation, Search, X, MapIcon } from "lucide-react"
import axios from "axios"
import styled from "styled-components"
import { motion } from "framer-motion"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import CarRental from "./filter"
import Navbar from "./Navbar"

// Styled Components
const LogoText = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(90deg, #3b82f6, #22c55e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 1px;
`

const StationCard = styled(motion.div)`
  background: #1a1a1a;
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid #2a2a2a;
  transition: transform 0.3s ease;

  &:hover {
    border-color: #3b82f6;
  }
`

const FuturisticInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  background: #1a1a1a;
  border: 1px solid #2a2a2a;
  border-radius: 0.75rem;
  color: white;
  font-size: 0.875rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
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
  background: ${props => props.$secondary ? 'transparent' : 'linear-gradient(to right, #3b82f6, #22c55e)'};
  border: ${props => props.$secondary ? '1px solid #3b82f6' : 'none'};
  border-radius: 0.75rem;
  color: white;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`

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

  const { category } = useParams()
  const [selectedSlotNumber, setSelectedSlotNumber] = useState(null)
  const [selectedVehicleType, setSelectedVehicleType] = useState(category || 'all')
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
        'Bikes': ['ola', 'ather', 'tvs', 'bajaj', 'hero', 'rorr'],
        'Cars': ['smc'],
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
    navigate(`/booking/${slot._id}`);
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
    <div className="bg-black min-h-screen text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
        {/* Hero Section with Background Image */}
        <div className="relative h-64 sm:h-80 md:h-96 mb-8 sm:mb-12 md:mb-16">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url("https://i.pinimg.com/474x/a2/88/32/a28832bd28790cd14caaa00a3d92e04e.jpg")',
              filter: 'brightness(0.7)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30" />
          <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
              Find Charging Stations
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-4 sm:mb-6 max-w-2xl">
              Locate and book charging stations for your electric vehicle with ease
            </p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="max-w-6xl mx-auto mb-6 sm:mb-8 md:mb-10 px-4">
          <div className="bg-gray-900 rounded-xl p-4 sm:p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
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
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center w-full sm:w-auto">
                {[
                  { label: 'All', value: 'all' },
                  { label: 'Bikes', value: 'Bikes' },
                  { label: 'Cars', value: 'Cars' },
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
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm transition-all ${selectedVehicleType === type.value
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
                className="flex items-center gap-2 px-4 sm:px-6 py-1.5 sm:py-2 bg-blue-500 hover:bg-blue-600 rounded-full transition-all text-sm"
              >
                <MapIcon size={18} className="sm:w-5 sm:h-5" />
                <span>Near Me</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stations Grid */}
        <motion.div
          className="bg-gray-900 rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-8 sm:py-12">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-red-400 font-medium text-base sm:text-lg mb-2">Error Loading Stations</p>
              <p className="text-gray-400 text-sm">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-cards gap-4 sm:gap-6 md:gap-8">
              {filteredSlots.map((slot) => (
                <StationCard
                  key={slot._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                  className="w-full"
                >
                  <div className="relative overflow-hidden rounded-t-xl h-48 sm:h-56 md:h-64">
                    <img
                      src={"http://localhost:8080/" + slot.image || "/placeholder.svg?height=200&width=400"}
                      alt={slot.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">{slot.name}</h3>
                    <p className="text-sm text-gray-300 flex items-center mb-2">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-400" /> {slot.address}
                    </p>
                    {isNearMeActive && slot.distance && (
                      <p className="text-sm text-gray-300 flex items-center mb-2">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-400" />
                        {slot.distance.toFixed(1)} km away
                      </p>
                    )}
                    <p className="text-sm text-gray-300 flex items-center mb-4">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-400" /> 8:30 AM - 8:30 PM
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
                      <FuturisticButton onClick={() => handleSlotSelect(slot)} className="flex-1">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Book Slot
                      </FuturisticButton>
                      <FuturisticButton
                        onClick={() => handleNavigateToMaps(slot.address, slot.name)}
                        className="flex-1"
                        $secondary
                      >
                        <Navigation className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Navigate
                      </FuturisticButton>
                    </div>
                  </div>
                </StationCard>
              ))}
            </div>
          )}
        </motion.div>
      </main>

      <footer className="py-4 sm:py-6 px-4 sm:px-6 md:px-10 border-t border-gray-800 text-center text-gray-500">
        <p className="text-sm">© 2024 VOLTHUB. All rights reserved.</p>
      </footer>

      <ToastContainer />
    </div>
  )
}

const NavLinks = styled.a`
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

export default Evmap

