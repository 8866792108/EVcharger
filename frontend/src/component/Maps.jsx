import React, { useEffect, useState } from 'react'
import ResponsiveSidebar from './ResponsiveSidebar'
// import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { stations } from '../assets/utility'
import { marker,icon } from 'leaflet'
// import map from "https://cdn-icons-png.flaticon.com/512/684/684908.png"

const Maps = () => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [current, setcurrent] = useState()
  const navigateToMarker = (markerPosition) => {
    const { lat, lng } = markerPosition;
    console.log(markerPosition);
    const currentLocation = "Your current location";
    // console.log(lat,"  ",lng)
    const navigateUrl = `https://www.google.com/maps/dir/${current.lat},${current.long}/${lat},${lng}`;
    window.open(navigateUrl, '_blank');
  };

  useEffect(() => {
    setTimeout(() => {
      navigator.geolocation.getCurrentPosition((data) => {
        const crd = data.coords;
        console.log(crd.latitude);
        console.log(crd.longitude);
        setcurrent({
          lat: crd.latitude,
          long: crd.longitude
        })
      })
    }, 1000);
  }, [])




  return (
    <div className='home'>
      <ResponsiveSidebar />
      <main className="md:pl-16 md:transition-all md:duration-300 md:data-[expanded=true]:pl-64">
        {current && (

        <div className="h-[calc(100vh-4rem)]">
          <MapContainer
            center={[current.lat, current.long]}
            zoom={25}
            className="h-[100%] w-[100%]"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {stations.map(station => (
              <Marker
                key={station.id}
                position={[station.location.lat, station.location.lng]}
                
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-semibold">{station.name}</h3>
                    <p>
                      Available: {station.availableSlots}/{station.totalSlots} slots
                    </p>
                    <p>Power: {station.powerOutput}</p>
                    <p>Price: ${station.price}/kWh</p>
                    <button onClick={() => navigateToMarker(station.location)} className="mt-2 bg-green-500 text-white px-4 py-1 rounded-full text-sm">
                      Navigate
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        )}
      </main>
    </div>
  )
}

export default Maps