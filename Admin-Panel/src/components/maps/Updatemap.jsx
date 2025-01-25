import { Upload, User } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios'

const Updatemap = () => {
    const [mapinfo, setmapinfo] = useState({
        name: '',
        address: '',
        latitude: 0,
        longitude: 0
    })
    const [Image, setImage] = useState({
        previewurl: null,
        file: null
    })

    const hadlechange = (e) => {
        const { name, value } = e.target
        const copymapinfo = { ...mapinfo }
        copymapinfo[name] = value
        setmapinfo(copymapinfo)
        console.log(mapinfo)
    }

    

    const handlePhotoChange = e => {
        if (e.target.files[0].type === 'image/png' || e.target.files[0].type === 'image/jpeg') {
            //preview show
            const reader = new FileReader()
            reader.onload = (r) => {
                setImage({
                    previewurl: r.target.result,
                    file: e.target.files[0]
                })
                console.log(r.target.result);
                console.log(e.target.files[0])
            }
            reader.readAsDataURL(e.target.files[0])
        } else {
            handleerror("Invalid File !!")
            Image.file = null
        }

    }


    const handlesubmit = async (e) => {
        e.preventDefault();

        const { name, address, latitude, longitude } = mapinfo
        const formdata = new FormData();
        formdata.append("name", name)
        formdata.append("address", address)
        formdata.append("latitude", latitude)
        formdata.append("longitude", longitude)
        formdata.append("image", Image.file)

        try {
            const url = "http://localhost:8080/slots/setitems"

            const response = await axios.post(url, formdata, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
            if (response.data.success) {
                console.log("done");
                setmapinfo({
                    name: '',
                    address: '',
                    latitude: '',
                    longitude: ''
                })

            }
        } catch (error) {
            console.log("ERROR HANDLED :: ", error);

        }

    }
    return (
        <div className='MapAdd m-2'>

            <form onSubmit={handlesubmit} className='w-full max-w-lg'>

                {/* preview uploaded image */}
                <div className="flex">
                    <div className="relative mb-10">
                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {Image.previewurl ? (
                                <img
                                    src={Image.previewurl}
                                    alt="Profile Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <User className="h-10 w-10 text-black" />
                            )}
                        </div>
                        <label
                            htmlFor="photo-upload"
                            className="absolute bottom-0 right-0 bg-green-600 rounded-full p-2 cursor-pointer"
                        >
                            <Upload className="h-4 w-4 text-white" />
                        </label>
                        <input
                            id="photo-upload"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handlePhotoChange}
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="name" className="text-sm leading-7 text-gray-600">Name</label>
                    <input type="name"
                        onChange={hadlechange}
                        value={mapinfo.name}
                        id="name" name="name" className="w-full rounded border border-gray-300 bg-white py-1 px-3 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
                </div>
                <div className="mb-4">
                    <label htmlFor="latitude" className="text-sm leading-7 text-gray-600">Latitude</label>
                    <input type="number"
                        onChange={hadlechange}
                        value={mapinfo.latitude}
                        id="latitude" name="latitude" className="w-1/4 rounded border border-gray-300 bg-white py-1 px-3 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
                </div>
                <div className="mb-4">
                    <label htmlFor="longitude" className="text-sm leading-7 text-gray-600">Longitude</label>
                    <input type="number"
                        onChange={hadlechange}
                        value={mapinfo.longitude}
                        id="longitude" name="longitude" className="w-1/4 rounded border border-gray-300 bg-white py-1 px-3 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
                </div>

                <div className="mb-4">
                    <label htmlFor="address" className="text-sm leading-7 text-gray-600">Address</label>
                    <textarea id="address"
                        name="address"
                        onChange={hadlechange}
                        value={mapinfo.address}
                        className="h-32 w-full resize-none rounded border border-gray-300 bg-white py-1 px-3 text-base leading-6 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"></textarea>
                </div>
                <button className="rounded border-0 bg-indigo-500 py-2 px-6 text-lg text-white hover:bg-indigo-600 focus:outline-none">Send</button>

            </form>
        </div>
    )
}

export default Updatemap