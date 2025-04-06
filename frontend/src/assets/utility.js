
import { toast } from 'react-toastify'
export const handlesuccess = (msg) => {
    toast.success(msg, {
        position: "top-center",
        autoClose: 2000
    })
}
export const handleerror = (msg) => {
    toast.error(msg, {
        position: "top-center",
        autoClose: 2000
    })
}

export function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}

export const stations = [
    {
        id: '1',
        name: 'Downtown Manhattan Hub',
        location: { lat: 40.7128, lng: -74.0060 },
        availableSlots: 5,
        totalSlots: 8,
        powerOutput: '150kW',
        price: 0.35
    },
    {
        id: '2',
        name: 'Central Park Station',
        location: { lat: 40.7859, lng: -73.9654 },
        availableSlots: 3,
        totalSlots: 6,
        powerOutput: '120kW',
        price: 0.32
    },
    {
        id: '3',
        name: 'Brooklyn Heights Charger',
        location: { lat: 40.6962, lng: -73.9937 },
        availableSlots: 2,
        totalSlots: 4,
        powerOutput: '100kW',
        price: 0.30
    },
    {
        id: '4',
        name: 'Queens Plaza Station',
        location: { lat: 21.1771924, lng:72.8683066 },
        availableSlots: 4,
        totalSlots: 6,
        powerOutput: '150kW',
        price: 0.33
    },
    {
        id: '5',
        name: 'Times Square Express',
        location: { lat: 40.7580, lng: -73.9855 },
        availableSlots: 6,
        totalSlots: 10,
        powerOutput: '200kW',
        price: 0.38
    },
    {
        id: '6',
        name: 'Hudson Yards Hub',
        location: { lat: 40.7539, lng: -74.0024 },
        availableSlots: 3,
        totalSlots: 8,
        powerOutput: '150kW',
        price: 0.34
    },
    {
        id: '7',
        name: 'East Village Power',
        location: { lat: 40.7264, lng: -73.9818 },
        availableSlots: 2,
        totalSlots: 4,
        powerOutput: '100kW',
        price: 0.31
    },
    {
        id: '8',
        name: 'SoHo Charging Point',
        location: { lat: 40.7233, lng: -74.0030 },
        availableSlots: 4,
        totalSlots: 6,
        powerOutput: '120kW',
        price: 0.33
    },
    {
        id: '9',
        name: 'Upper West Side Station',
        location: { lat: 40.7870, lng: -73.9754 },
        availableSlots: 5,
        totalSlots: 8,
        powerOutput: '150kW',
        price: 0.35
    },
    {
        id: '10',
        name: 'Battery Park Charger',
        location: { lat: 40.7033, lng: -74.0170 },
        availableSlots: 3,
        totalSlots: 6,
        powerOutput: '120kW',
        price: 0.32
    }
]

// export const backendurls = "https://volthub.onrender.com"
export const backendurls = "http://localhost:8080"

export const slotmoney = 25 
