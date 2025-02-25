import React, { useState, useEffect } from "react"
import {
    MapPin,
    Clock,
    Calendar,
    Zap,
    AlertCircle,
    X,
    CreditCard
} from "lucide-react"
import Maps from "./Maps"
import axios from "axios"


function Evmap() {
    const [slots, setSlots] = useState([])
    const [selectedSlot, setSelectedSlot] = useState(null)
    const [availableTimeSlots, setAvailableTimeSlots] = useState([])
    const [interval, setInterval] = useState("30")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showTimeSlotsModal, setShowTimeSlotsModal] = useState(false)
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
    const [showPaymentModal, setShowPaymentModal] = useState(false)
    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        amount: 25.0 // Default amount
    })

    useEffect(() => {
        const fetchSlots = async () => {
            try {
                setError(null)
                setLoading(true)

                try {
                    const response = await axios.get("http://localhost:8080/slots/getitems")


                    console.log(response);


                    const data = await response.data

                    console.log("the list of the slots stations :: " + data)

                    if (response.data.success) {
                        setSlots(response.data.data);
                    } else {
                        console.error("Failed to fetch stops");
                    }
                    // console.log(response.data.data)
                } catch (apiError) {
                    console.log("Using mock data as backend is not available")
                    // setSlots(mockSlots)
                }
            } catch (error) {
                console.error("Error fetching slots:", error)
                setError(
                    error instanceof Error
                        ? `Unable to load charging stations: ${error.message}`
                        : "Unable to load charging stations. Please ensure the backend server is running at http://localhost:8080"
                )
            } finally {
                setLoading(false)
            }
        }

        fetchSlots()
    }, [])

    const fetchAvailableSlots = async (slotId, interval = 30) => {

        try {
            try {
                setInterval(interval)
                const now = new Date()

                const requestData = {
                    startTime: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
                    endTime: "8:00 PM",
                    interval: parseInt(interval),
                    slotId: slotId
                };

                const response = await axios.post("http://localhost:8080/orders/api/available-slots", requestData)
                    .then((data) => {
                        console.log(data)
                        setAvailableTimeSlots(data.data.availableSlots)
                    })

                // const data = await response.data

                console.log("the available slots are the :: " + response)
                // setAvailableTimeSlots(response.data.data.availableSlots)
                // console.log(availableTimeSlots)
            } catch (apiError) {
                console.log("Using mock time slots as backend is not available" + apiError)
            }
        } catch (error) {
            console.error("Error fetching available slots:", error)
            alert(
                error instanceof Error
                    ? error.message
                    : "Failed to load available slots. Please try again."
            )
        }
    }

    const handleSlotSelect = slot => {
        console.log(slot);

        setSelectedSlot(slot)
        console.log("selected slot is the :: " + selectedSlot)
        // console.log(selectedSlot);

        fetchAvailableSlots(slot)
        setShowTimeSlotsModal(true)
    }

    const handleTimeSlotSelect = timeSlot => {
        setSelectedTimeSlot(timeSlot)
        setShowPaymentModal(true)
    }

    const handlePayment = async () => {
        if (!selectedSlot || !selectedTimeSlot) return

        try {
            const response = await fetch(
                "http://localhost:8080/orders/api/book-slot",
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                    mode: "cors",
                    credentials: "include",
                    body: JSON.stringify({
                        userId: "user123",
                        slotId: selectedSlot,
                        start: selectedTimeSlot.start,
                        end: selectedTimeSlot.end,
                        payment: paymentDetails
                    })
                }
            )

            if (!response.ok) {
                const errorData = await response.json().catch(() => null)
                throw new Error(errorData?.message || "Failed to process payment")
            }

            alert("Payment successful! Your slot has been booked.")
            setShowPaymentModal(false)
            setShowTimeSlotsModal(false)
            setSelectedTimeSlot(null)
            fetchAvailableSlots(selectedSlot)
        } catch (error) {
            if (error instanceof Error && error.message.includes("Failed to fetch")) {
                alert("Demo mode: Payment simulation successful!")
                setShowPaymentModal(false)
                setShowTimeSlotsModal(false)
            } else {
                alert(
                    error instanceof Error
                        ? error.message
                        : "Payment failed. Please try again."
                )
            }
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            {/* Main Content */}
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 md:grid max-md:flex max-md:flex-col-reverse md:grid-cols-350a gap-4 h-[100vh]">
                <div className="bg-white rounded-xl shadow-sm border border-indigo-100 overflow-y-scroll">
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
                                {slots.map(slot => (
                                    <div
                                        key={slot._id}
                                        onClick={() => handleSlotSelect(slot._id)}
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
                                                    {slot.start} -{" "}
                                                    {slot.end}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="w-full bg-gray-50 m-auto">
                    <div className="bg-white rounded-xl shadow-sm border border-indigo-100 z-0 ">
                        <Maps />
                    </div>
                </div>
            </div>

            {/* Time Slots Modal */}
            {showTimeSlotsModal && selectedSlot && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-[500]">
                    <div className="bg-white w-full max-w-md h-full overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    Available Time Slots
                                </h2>
                                <button
                                    onClick={() => setShowTimeSlotsModal(false)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <p className="text-gray-500 mt-1">
                                Book your slot at {selectedSlot.name}
                            </p>

                            <div className="mt-4">
                                <label className="text-sm font-medium text-gray-700">
                                    Time Interval:
                                </label>
                                <select
                                    value={interval}
                                    onChange={e => {
                                        setInterval(e.target.value)
                                        fetchAvailableSlots(selectedSlot._id, e.target.value)
                                    }}
                                    className="mt-1 block w-full rounded-md border text-gray-800 border-gray-500 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                >
                                    <option value="20">20 minutes</option>
                                    <option value="30">30 minutes</option>
                                    <option value="60">60 minutes</option>
                                </select>
                            </div>
                        </div>

                        <div className="p-6 grid grid-cols-2 gap-4">
                            {availableTimeSlots > 0
                                ? availableTimeSlots.map((timeSlot, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleTimeSlotSelect(timeSlot)}
                                        className="p-4 text-center rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all"
                                    >
                                        <Calendar className="w-5 h-5 mx-auto mb-2 text-indigo-600" />
                                        <p className="font-medium text-gray-900">{timeSlot.start}</p>
                                        <p className="text-sm text-gray-500">to</p>
                                        <p className="font-medium text-gray-900">{timeSlot.end}</p>
                                    </button>
                                ))
                                : <div className="flex justify-center items-center w-[36vw] h-[60vh] text-gray-500">
                                    <div>
                                        Not Available Slots
                                    </div>
                                </div>
                            }
                            { }
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && selectedTimeSlot && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-900">
                    <div className="bg-white w-full max-w-md rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Payment Details
                            </h2>
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Card Number
                                </label>
                                <input
                                    type="text"
                                    placeholder="1234 5678 9012 3456"
                                    value={paymentDetails.cardNumber}
                                    onChange={e =>
                                        setPaymentDetails({
                                            ...paymentDetails,
                                            cardNumber: e.target.value
                                        })
                                    }
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Expiry Date
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="MM/YY"
                                        value={paymentDetails.expiryDate}
                                        onChange={e =>
                                            setPaymentDetails({
                                                ...paymentDetails,
                                                expiryDate: e.target.value
                                            })
                                        }
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        CVV
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="123"
                                        value={paymentDetails.cvv}
                                        onChange={e =>
                                            setPaymentDetails({
                                                ...paymentDetails,
                                                cvv: e.target.value
                                            })
                                        }
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700">Amount:</span>
                                    <span className="text-lg font-semibold text-gray-900">
                                        ${paymentDetails.amount.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handlePayment}
                                className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                            >
                                <CreditCard className="w-5 h-5" />
                                <span>Pay Now</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Evmap