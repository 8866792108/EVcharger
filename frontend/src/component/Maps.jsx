import React, { useEffect, useState } from 'react'
import ResponsiveSidebar from './ResponsiveSidebar'
// import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import axios from 'axios'
import { Icon } from 'leaflet'
import Navbar from './Navbar'
// import map from "https://cdn-icons-png.flaticon.com/512/684/684908.png"


const Maps = () => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [current, setcurrent] = useState()
  const [stops, setStops] = useState([]);

  const legalIcons = new Icon({
    iconUrl: 'https://img.icons8.com/external-icongeek26-linear-colour-icongeek26/64/external-legal-business-and-finance-icongeek26-linear-colour-icongeek26.png',
    iconSize: [35, 35], // size of the icon
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor

  })
  const legalIcon = new Icon({
    iconUrl: 'https://cdn1.iconfinder.com/data/icons/location-pointer-1/64/Electricity-512.png',
    iconSize: [35, 35], // size of the icon
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor

  })


  const fetchStops = async () => {
    try {
      const response = await axios.get("http://localhost:8080/slots/getitems")
      console.log(response.data.data[0].name);
      const data = await response.data
      console.log(data)

      if (data.success) {
        setStops(data.data);
      } else {
        console.error("Failed to fetch stops");
      }
    } catch (error) {
      console.error("Error fetching stops:", error);
    }
  };
  useEffect(() => {

    fetchStops();
  }, []);

  useEffect(() => {
    console.log("Updated stops:", stops);
  }, [stops]);

  const navigateToMarker = (address, name) => {
    const NewAdd = address.replaceAll(" ", "+")
    const NewName = name.replaceAll(" ", "+")
    console.log("new address :: " + NewName + NewAdd);

    // console.log(lat,"  ",lng)
    const navigateUrl = `https://www.google.com/maps/dir/${current.lat},${current.long}/${NewName},${NewAdd}`;


    window.open(navigateUrl, '_blank');
  };

  useEffect(() => {
    setTimeout(() => {
      // console.log("hiii");
      // evstations()
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
    <div className='home flex flex-col items-center justify-center min-h-screen'>
      {/* Horizontal Sidebar */}
      <nav className="py-6 px-10 flex justify-between items-center border-b border-gray-800 fixed top-0 left-0 right-0 z-[500] bg-black">
        <Navbar />
      </nav>

      <main className="flex-1 w-full  p-4 md:transition-all md:duration-300 mt-8">
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
              <Marker
                position={[current.lat, current.long]}
              >
                <Popup>
                  <div>
                    Your Current Location
                  </div>
                </Popup>
              </Marker>
              {stops.map(stops => (
                <Marker
                  key={stops._id}
                  position={[stops.latitude, stops.longitude]}
                  icon={legalIcon}

                >
                  <Popup>
                    <div className="w-[300px] flex flex-col justify-center items-center">
                      <img src={"http://localhost:8080/" + stops.image} alt="" className=' w- mb-7' />
                      <h3 className="font-semibold">{stops.name}</h3>
                      <p>
                        Address: {stops.address}
                      </p>
                      {/* <p>Power: {stops.lat}</p>
                      <p>Price: ${stops.long}/kWh</p> */}
                      <button onClick={() => navigateToMarker(stops.address, stops.name)} className="mt-2 bg-green-500 text-white px-4 py-1 rounded-full text-sm">
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