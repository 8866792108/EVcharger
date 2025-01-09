import React, { useEffect, useState } from 'react'
import ResponsiveSidebar from './ResponsiveSidebar'
// import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { stations } from '../assets/utility'
import { marker, icon } from 'leaflet'
import axios from 'axios'
// import map from "https://cdn-icons-png.flaticon.com/512/684/684908.png"


const Maps = () => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [current, setcurrent] = useState()
  // const [slots, setslots] = useState([])
  const [stops, setStops] = useState([]);

  // const evstations = async () => {
  //   try {
  //     const response = await fetch("http://localhost:8080/slots/getitems")
  //     const data = await response.json()
  //     console.log(data.data);
  //     if (data.success) {
  //       console.log(" here is done done");
  //       console.log(data.data);
  //       setslots(data.data)
  //       console.log("Slots are here: ", slots)
  //     }

  //   } catch (error) {
  //     alert(error)
  //   }
  // }

  useEffect(() => {
    const fetchStops = async () => {
      try {
        const response = await fetch("http://localhost:8080/slots/getitems");
        const json = await response.json();
        if (json.success) {
          setStops(json.data);
        } else {
          console.error("Failed to fetch stops");
        }
      } catch (error) {
        console.error("Error fetching stops:", error);
      }
    };

    fetchStops();
  }, []);

  useEffect(() => {
    console.log("Updated stops:", stops);
  }, [stops]);

  // const navigateToMarker = (latitude, longitude) => {
  //   // console.log(lat,"  ",lng)
  //   // const navigateUrl = `https://www.google.com/maps/dir/${current.lat},${current.long}/${latitude},${longitude}`;
  //   const navigateUrl = `https://www.google.com/maps/dir/${current.lat},${current.long}/Electric+Vehicle+Charging+Station,+201,+Torrent+Power+Ring+Rd,+New+Textile+Market,+Surat,+Gujarat+395008`;
  //   // const navigateUrl = `https://www.google.com/maps/dir/?api=1&origin=${current.lat},${current.long}&destination=${latitude},${longitude}&travelmode=driving&dir_action=navigate`;

  //   window.open(navigateUrl, '_blank');
  // };
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
    <div className='home md:grid grid-cols-header'>
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
              {stops.map(stops => (
                <Marker
                  key={stops._id}
                  position={[stops.lat, 72.8237165]}

                >
                  <Popup>
                    <div className=" w-[300px] flex flex-col justify-center items-center">
                      <img src={stops.image} alt="" className=' mb-7' />
                      <h3 className="font-semibold">{stops.name}</h3>
                      <p>
                        Address: {stops.address}
                      </p>
                      <p>Power: {stops.lat}</p>
                      <p>Price: ${stops.long}/kWh</p>
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