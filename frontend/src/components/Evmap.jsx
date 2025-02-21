// import React, { useEffect, useState } from 'react'
// import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet"
// import "leaflet/dist/leaflet.css"
// import axios from 'axios'
// import { Icon } from 'leaflet'
// import Select from 'react-select'
// const Evmap = () => {

//     const [selectedMarker, setSelectedMarker] = useState(null);
//     const [current, setcurrent] = useState()
//     const [stops, setStops] = useState([]);
//     const [selectedOptions, setselectedOptions] = useState([])

//     const handleChange = (selectedOptions) => {
//         setselectedOptions(selectedOptions)
//         console.log(selectedOptions)
//     }
//     const options = [
//         { value: '20', label: '20 minutes' },
//         { value: '30', label: '30 minutes' },
//         { value: '60', label: '60 minutes' }
//     ]



//     const legalIcons = new Icon({
//         iconUrl: 'https://img.icons8.com/external-icongeek26-linear-colour-icongeek26/64/external-legal-business-and-finance-icongeek26-linear-colour-icongeek26.png',
//         iconSize: [35, 35], // size of the icon
//         iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
//         popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor

//     })
//     const legalIcon = new Icon({
//         iconUrl: 'https://cdn1.iconfinder.com/data/icons/location-pointer-1/64/Electricity-512.png',
//         iconSize: [35, 35], // size of the icon
//         iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
//         popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor

//     })


//     const fetchStops = async () => {
//         try {
//             const response = await axios.get("http://localhost:8080/slots/getitems")
//             console.log(response.data.data[0].name);
//             const data = await response.data
//             console.log(data)

//             if (data.success) {
//                 setStops(data.data);
//             } else {
//                 console.error("Failed to fetch stops");
//             }
//         } catch (error) {
//             console.error("Error fetching stops:", error);
//         }
//     };
//     useEffect(() => {

//         fetchStops();
//     }, []);

//     useEffect(() => {
//         console.log("Updated stops:", stops);
//     }, [stops]);

//     const navigateToMarker = (address, name) => {
//         const NewAdd = address.replaceAll(" ", "+")
//         const NewName = name.replaceAll(" ", "+")
//         console.log("new address :: " + NewName + NewAdd);

//         // console.log(lat,"  ",lng)
//         const navigateUrl = `https://www.google.com/maps/dir/${current.lat},${current.long}/${NewName},${NewAdd}`;


//         window.open(navigateUrl, '_blank');
//     };

//     useEffect(() => {
//         setTimeout(() => {
//             // console.log("hiii");
//             // evstations()
//             navigator.geolocation.getCurrentPosition((data) => {
//                 const crd = data.coords;
//                 console.log(crd.latitude);
//                 console.log(crd.longitude);
//                 setcurrent({
//                     lat: crd.latitude,
//                     long: crd.longitude
//                 })
//             })
//         }, 1000);
//     }, [])



//     return (
//         <div className='evmap md:grid grid-cols-header h-[100vh] m-2'>
//             <div className="map max-md:h-[60%]">
//                 {current && (

//                     <div className="h-full">
//                         <MapContainer
//                             center={[current.lat, current.long]}
//                             zoom={25}
//                             className="h-[100%] w-[100%]"
//                         >
//                             <TileLayer
//                                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                             />
//                             <Marker
//                                 position={[current.lat, current.long]}
//                             >
//                                 <Popup>
//                                     your Location
//                                 </Popup>
//                             </Marker>
//                             {stops.map(stops => (
//                                 <Marker
//                                     key={stops._id}
//                                     position={[stops.latitude, stops.longitude]}
//                                     icon={legalIcon}

//                                 >
//                                     <Popup>
//                                         <div className="w-[300px] flex flex-col justify-center items-center">
//                                             <img src={"http://localhost:8080/" + stops.image} alt="" className=' mb-7' />
//                                             <h3 className="font-semibold">{stops.name}</h3>
//                                             <p>
//                                                 Address: {stops.address}
//                                             </p>
//                                             {/* <p>Power: {stops.lat}</p>
//                                   <p>Price: ${stops.long}/kWh</p> */}
//                                             <button onClick={() => navigateToMarker(stops.address, stops.name)} className="mt-2 bg-green-500 text-white px-4 py-1 rounded-full text-sm">
//                                                 Navigate
//                                             </button>
//                                         </div>
//                                     </Popup>
//                                 </Marker>
//                             ))}
//                         </MapContainer>
//                     </div>
//                 )}

//             </div>
//             <div className="lists bg-yellow-500 max-md:h-[40%]">
//                 {/* <div className="filter w-[80%] m-auto mt-2">
//                     <Select
//                         options={options}
//                         value={selectedOptions}
//                         onChange={handleChange}
//                         isMulti={true}
//                     />
//                 </div> */}
//                 <div className="slots-list flex flex-row gap-[5px] m-[10px] family-fantasy bg-gray-700 rounded-lg w-full">
//                     <div className="img w-[20%]">
//                         <img src="../src/assets/imgs/pic4.png" className='h-[100px]' alt="" />
//                     </div>
//                     <div className="contain w-[70%]">
//                         <p className="name text-lg">SMC ELECTRICLE VEHICLE</p>
//                         <span className="address text-sm font-sans">
//                             4RX8+HF6, Pandesara GIDC Main Road, GIDC, Trupte Nagar, Pandesara, Udhana, Surat, Gujarat 394220
//                         </span>
//                     </div>
//                     <div className="dir w-[10%] my-auto">
//                         <img src="../src/assets/imgs/pic1.png" alt="" className='m-[50% 0] object-cover' />
//                         <img src="../src/assets/imgs/pic1.png" alt="" className='m-[50% 0] object-cover' />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Evmap



const mockSlots = [
    {
        _id: "1",
        name: "Downtown Charging Station",
        address: "123 Main St, Downtown",
        image:
            "https://images.unsplash.com/photo-1697650786218-65a29882e9c1?auto=format&fit=crop&w=800&q=80",
        latitude: 40.7128,
        longitude: -74.006,
        start: new Date("2024-03-19T08:00:00"),
        end: new Date("2024-03-19T20:00:00")
    },
    {
        _id: "2",
        name: "Westside EV Hub",
        address: "456 West Ave",
        image:
            "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80",
        latitude: 40.7589,
        longitude: -73.9851,
        start: new Date("2024-03-19T07:00:00"),
        end: new Date("2024-03-19T22:00:00")
    },
    {
        _id: "2",
        name: "Westside EV Hub",
        address: "456 West Ave",
        image:
            "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80",
        latitude: 40.7589,
        longitude: -73.9851,
        start: new Date("2024-03-19T07:00:00"),
        end: new Date("2024-03-19T22:00:00")
    }
]

const mockTimeSlots = [
    { start: "09:00 AM", end: "09:30 AM" },
    { start: "09:30 AM", end: "10:00 AM" },
    { start: "10:00 AM", end: "10:30 AM" },
    { start: "10:30 AM", end: "11:00 AM" }
]



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
import Navbar from "./Navbar"
import Maps from "../component/Maps"
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
                // const response = await fetch(
                //     "http://localhost:8080/orders/api/available-slots",
                //     {
                //         method: "POST",
                //         headers: {
                //             Accept: "application/json",
                //             "Content-Type": "application/json"
                //         },
                //         mode: "cors",
                //         credentials: "include",
                //         body: JSON.stringify({
                //             startTime: now.toLocaleTimeString("en-US", {
                //                 hour: "2-digit",
                //                 minute: "2-digit"
                //             }),
                //             endTime: "11:59 PM",
                //             interval: parseInt(interval)
                //         })
                //     }
                // )

                // const formdata = new FormData();
                // formdata.append("startTime", now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }))
                // formdata.append("endTime", "8:00 PM")
                // formdata.append("interval", parseInt(interval))
                // formdata.append("slotId", "6790760b5b371fe89e2f0b1d")
                // const response = await axios("http://localhost:8080/orders/api/available-slots", formdata, {
                //     headers: {
                //         "Content-Type": "application/json",
                //     }
                // })

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
            <Navbar />

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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-40">
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
                                    className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                >
                                    <option value="20">20 minutes</option>
                                    <option value="30">30 minutes</option>
                                    <option value="60">60 minutes</option>
                                </select>
                            </div>
                        </div>

                        <div className="p-6 grid grid-cols-2 gap-4">
                            {availableTimeSlots.map((timeSlot, index) => (
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
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && selectedTimeSlot && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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