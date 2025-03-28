// import { Upload, User } from 'lucide-react'
// import React, { useEffect, useState } from 'react'
// import axios from 'axios'
// import { useParams } from 'react-router-dom'

// const Updatemap = () => {
//     const [mapinfo, setmapinfo] = useState({
//         name: '',
//         address: '',
//         latitude: 0,
//         longitude: 0
//     })
//     const [Image, setImage] = useState({
//         previewurl: null,
//         file: null
//     })

//     const { id } = useParams();

//     useEffect(() => {
//         async function fetchData() {
//             try {
//                 const response = await axios.get(`http://localhost:8080/slots/find/${id}`);
//                 console.log(response.data)

//                 setmapinfo({
//                     name: response.data.name,
//                     address: response.data.address,
//                     latitude: response.data.latitude,
//                     longitude: response.data.longitude,
//                     start: response.data.start,
//                     end: response.data.end
//                 })
//             } catch (error) {
//                 console.error("Error fetching data:", error);
//             }
//         }
//         fetchData();
//     }, [id])

//     const convertTo12Hour = (time24) => {
//         let [hours, minutes] = time24.split(":");
//         let period = +hours >= 12 ? "PM" : "AM";
//         let hours12 = +hours % 12 || 12; // Convert 24-hour to 12-hour format
//         return `${hours12}:${minutes} ${period}`;
//     }



//     const convertTo24Hour = (time12) => {
//         let [time, period] = time12.split(" ");
//         let [hours, minutes] = time.split(":");
//         if (period === "PM" && hours !== "12") hours = +hours + 12;
//         if (period === "AM" && hours === "12") hours = "00";
//         return `${hours}:${minutes}`;
//     }


//     const hadlechange = (e) => {
//         const { name, value } = e.target
//         const copymapinfo = { ...mapinfo }
//         copymapinfo[name] = value
//         setmapinfo(copymapinfo)
//         console.log(mapinfo)
//     }



//     const handlePhotoChange = e => {
//         if (e.target.files[0].type === 'image/png' || e.target.files[0].type === 'image/jpeg') {
//             //preview show
//             const reader = new FileReader()
//             reader.onload = (r) => {
//                 setImage({
//                     previewurl: r.target.result,
//                     file: e.target.files[0]
//                 })
//                 console.log(r.target.result);
//                 console.log(e.target.files[0])
//             }
//             reader.readAsDataURL(e.target.files[0])
//         } else {
//             handleerror("Invalid File !!")
//             Image.file = null
//         }

//     }


//     const handlesubmit = async (e) => {
//         e.preventDefault();

//         const { name, address, latitude, longitude } = mapinfo
//         const formdata = new FormData();
//         formdata.append("name", name)
//         formdata.append("address", address)
//         formdata.append("latitude", latitude)
//         formdata.append("longitude", longitude)
//         formdata.append("image", Image.file)

//         try {
//             const url = "http://localhost:8080/slots/setitems"

//             const response = await axios.post(url, formdata, {
//                 headers: {
//                     "Content-Type": "multipart/form-data"
//                 }
//             })
//             if (response.data.success) {
//                 console.log("done");
//                 setmapinfo({
//                     name: '',
//                     address: '',
//                     latitude: '',
//                     longitude: ''
//                 })

//             }
//         } catch (error) {
//             console.log("ERROR HANDLED :: ", error);

//         }

//     }
//     return (
//         <div className='MapAdd m-2'>

//             <form onSubmit={handlesubmit} className='w-full max-w-lg'>

//                 {/* preview uploaded image */}
//                 <div className="flex">
//                     <div className="relative mb-10">
//                         <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
//                             {Image.previewurl ? (
//                                 <img
//                                     src={Image.previewurl}
//                                     alt="Profile Preview"
//                                     className="w-full h-full object-cover"
//                                 />
//                             ) : (
//                                 <User className="h-10 w-10 text-black" />
//                             )}
//                         </div>
//                         <label
//                             htmlFor="photo-upload"
//                             className="absolute bottom-0 right-0 bg-green-600 rounded-full p-2 cursor-pointer"
//                         >
//                             <Upload className="h-4 w-4 text-white" />
//                         </label>
//                         <input
//                             id="photo-upload"
//                             type="file"
//                             className="hidden"
//                             accept="image/*"
//                             onChange={handlePhotoChange}
//                         />
//                     </div>
//                 </div>

//                 <div className="mb-4">
//                     <label htmlFor="name" className="text-sm leading-7 text-gray-600">Name</label>
//                     <input type="name"
//                         onChange={hadlechange}
//                         value={mapinfo.name}
//                         id="name" name="name" className="w-full rounded border border-gray-300 bg-white py-1 px-3 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
//                 </div>

//                 <div className="mb-4">
//                     <label htmlFor="address" className="text-sm leading-7 text-gray-600">Address</label>
//                     <textarea id="address"
//                         name="address"
//                         onChange={hadlechange}
//                         value={mapinfo.address}
//                         className="h-32 w-full resize-none rounded border border-gray-300 bg-white py-1 px-3 text-base leading-6 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"></textarea>
//                 </div>
//                 <div className="mb-4">
//                     <label htmlFor="latitude" className="text-sm leading-7 text-gray-600">Latitude</label>
//                     <input type="number"
//                         onChange={hadlechange}
//                         value={mapinfo.latitude}
//                         id="latitude" name="latitude" className="w-1/4 rounded border border-gray-300 bg-white py-1 px-3 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
//                 </div>
//                 <div className="mb-4">
//                     <label htmlFor="longitude" className="text-sm leading-7 text-gray-600">Longitude</label>
//                     <input type="number"
//                         onChange={hadlechange}
//                         value={mapinfo.longitude}
//                         id="longitude" name="longitude" className="w-1/4 rounded border border-gray-300 bg-white py-1 px-3 text-base leading-8 text-gray-700 outline-none transition-colors duration-200 ease-in-out focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200" />
//                 </div>

//                 <button className="rounded border-0 bg-indigo-500 py-2 px-6 text-lg text-white hover:bg-indigo-600 focus:outline-none">Send</button>

//             </form>
//         </div>
//     )
// }

// export default Updatemap

import { Upload, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const Updatemap = () => {
    const [mapinfo, setmapinfo] = useState({
        name: "",
        address: "",
        latitude: 0,
        longitude: 0,
    });

    const [Image, setImage] = useState({
        previewurl: null, // Existing or new preview URL
        file: null,       // File object for upload
    });

    const { id } = useParams();

    useEffect(() => {
        fetchData();
    }, [id]);
    async function fetchData() {
        try {
            const response = await axios.get(`http://localhost:8080/slots/find/${id}`);
            console.log(response.data);

            setmapinfo({
                name: response.data.name,
                address: response.data.address,
                latitude: response.data.latitude,
                longitude: response.data.longitude,
                start: response.data.start,
                end: response.data.end,
            });

            // If an image already exists, show it
            if (response.data.image) {
                setImage((prev) => ({
                    ...prev,
                    previewurl: response.data.image, // Assuming backend provides full URL
                }));
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setmapinfo((prev) => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];

        if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
            // Show preview
            const reader = new FileReader();
            reader.onload = (r) => {
                setImage({
                    previewurl: r.target.result,
                    file: file,
                });
            };
            reader.readAsDataURL(file);
        } else {
            alert("Invalid File! Please upload PNG or JPEG.");
            setImage((prev) => ({ ...prev, file: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, address, latitude, longitude } = mapinfo;
        const formData = new FormData();
        formData.append("name", name);
        formData.append("address", address);
        formData.append("latitude", latitude);
        formData.append("longitude", longitude);

        // If user selected a new image, upload it. If not, send an empty string.
        if (Image.file) {
            formData.append("image", Image.file);
        } else {
            formData.append("image", ""); // No change to image
        }

        try {
            const response = await axios.post(`http://localhost:8080/slots/setitems/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.success) {
                toast.success(response.data.message || "Updated SuccessFully", {
                    position: "top-center",
                    autoClose: 2000,
                })
                fetchData()
                setImage({ previewurl: null, file: null });
            }
        } catch (error) {
            console.log("Error updating:", error);
        }
    };

    return (
        <div className="MapAdd m-2">
            <form onSubmit={handleSubmit} className="w-full max-w-lg">
                {/* Image Preview */}
                <div className="flex">
                    <div className="relative mb-10">
                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {Image.previewurl ? (
                                <img
                                    src={`http://localhost:8080/${Image.previewurl}`}
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

                {/* Form Inputs */}
                <div className="mb-4">
                    <label htmlFor="name" className="text-sm leading-7 text-gray-600">
                        Name
                    </label>
                    <input
                        type="text"
                        onChange={handleChange}
                        value={mapinfo.name}
                        id="name"
                        name="name"
                        className="w-full rounded border border-gray-300 bg-white py-1 px-3 text-base text-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="address" className="text-sm leading-7 text-gray-600">
                        Address
                    </label>
                    <textarea
                        id="address"
                        name="address"
                        onChange={handleChange}
                        value={mapinfo.address}
                        className="h-32 w-full rounded border border-gray-300 bg-white py-1 px-3 text-base text-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    ></textarea>
                </div>

                <div className="mb-4">
                    <label htmlFor="latitude" className="text-sm leading-7 text-gray-600">
                        Latitude
                    </label>
                    <input
                        type="number"
                        onChange={handleChange}
                        value={mapinfo.latitude}
                        id="latitude"
                        name="latitude"
                        className="w-1/4 rounded border border-gray-300 bg-white py-1 px-3 text-base text-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="longitude" className="text-sm leading-7 text-gray-600">
                        Longitude
                    </label>
                    <input
                        type="number"
                        onChange={handleChange}
                        value={mapinfo.longitude}
                        id="longitude"
                        name="longitude"
                        className="w-1/4 rounded border border-gray-300 bg-white py-1 px-3 text-base text-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    />
                </div>

                <button className="rounded bg-indigo-500 py-2 px-6 text-lg text-white hover:bg-indigo-600">
                    Update
                </button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default Updatemap;
