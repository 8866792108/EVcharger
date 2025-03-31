import { Upload, User, MapPin, Send, Loader2, Map } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import { motion } from 'framer-motion'

const MapAdd = ({ url }) => {
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
  const [isLoading, setIsLoading] = useState(false)
  const [mapUrl, setMapUrl] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (mapinfo.latitude && mapinfo.longitude) {
      setMapUrl(`https://www.google.com/maps/embed/v1/place?key=AIzaSyCYEASBpWyQMhR75YNsWrcuPDwetlpk0Dc&q=${mapinfo.latitude},${mapinfo.longitude}`)
    }
  }, [mapinfo.latitude, mapinfo.longitude])

  const validateForm = () => {
    const newErrors = {}

    if (!mapinfo.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!mapinfo.address.trim()) {
      newErrors.address = 'Address is required'
    }

    if (!mapinfo.latitude) {
      newErrors.latitude = 'Latitude is required'
    } else if (isNaN(mapinfo.latitude) || mapinfo.latitude < -90 || mapinfo.latitude > 90) {
      newErrors.latitude = 'Invalid latitude value'
    }

    if (!mapinfo.longitude) {
      newErrors.longitude = 'Longitude is required'
    } else if (isNaN(mapinfo.longitude) || mapinfo.longitude < -180 || mapinfo.longitude > 180) {
      newErrors.longitude = 'Invalid longitude value'
    }

    if (!Image.file) {
      newErrors.image = 'Location image is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const hadlechange = (e) => {
    const { name, value } = e.target
    setmapinfo(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handlePhotoChange = e => {
    if (e.target.files[0]?.type === 'image/png' || e.target.files[0]?.type === 'image/jpeg') {
      const reader = new FileReader()
      reader.onload = (r) => {
        setImage({
          previewurl: r.target.result,
          file: e.target.files[0]
        })
      }
      reader.readAsDataURL(e.target.files[0])
      // Clear image error when user selects a file
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: '' }))
      }
    } else {
      toast.error("Please upload a valid image file (PNG or JPEG)")
      setImage(prev => ({ ...prev, file: null }))
      setErrors(prev => ({ ...prev, image: 'Invalid file type' }))
    }
  }

  const handlesubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    const formdata = new FormData()
    Object.keys(mapinfo).forEach(key => {
      formdata.append(key, mapinfo[key])
    })
    if (Image.file) {
      formdata.append("image", Image.file)
    }

    try {
      const response = await axios.post(`${url}/slots/setitems`, formdata, {
        headers: { "Content-Type": "multipart/form-data" }
      })

      if (response.data.success) {
        toast.success(response.data.message || "Location Added Successfully")
        setmapinfo({
          name: '',
          address: '',
          latitude: '',
          longitude: ''
        })
        setImage({ previewurl: null, file: null })
        setErrors({})
      }
    } catch (error) {
      toast.error("Failed to add location. Please try again.")
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg"
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-800 mb-6"
      >
        Add New Location
      </motion.h2>

      <form onSubmit={handlesubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Form */}
          <div className="space-y-6">
            {/* Image Upload Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-4 border-gray-200">
                  {Image.previewurl ? (
                    <motion.img
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      src={Image.previewurl}
                      alt="Location Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                <motion.label
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  htmlFor="photo-upload"
                  className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer shadow-lg hover:bg-blue-600 transition-colors"
                >
                  <Upload className="h-5 w-5 text-white" />
                </motion.label>
                <input
                  id="photo-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </div>
              {errors.image && (
                <p className="text-red-500 text-sm mt-2">{errors.image}</p>
              )}
            </motion.div>

            {/* Form Fields */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location Name
                </label>
                <input
                  type="text"
                  onChange={hadlechange}
                  value={mapinfo.name}
                  name="name"
                  required
                  className={`w-full px-4 py-2 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  placeholder="Enter location name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  onChange={hadlechange}
                  value={mapinfo.address}
                  required
                  className={`w-full px-4 py-2 rounded-lg border ${errors.address ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-24 resize-none`}
                  placeholder="Enter full address"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </motion.div>

              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      onChange={hadlechange}
                      value={mapinfo.latitude}
                      name="latitude"
                      required
                      step="any"
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border ${errors.latitude ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                      placeholder="Enter latitude"
                    />
                  </div>
                  {errors.latitude && (
                    <p className="text-red-500 text-sm mt-1">{errors.latitude}</p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      onChange={hadlechange}
                      value={mapinfo.longitude}
                      name="longitude"
                      required
                      step="any"
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border ${errors.longitude ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                      placeholder="Enter longitude"
                    />
                  </div>
                  {errors.longitude && (
                    <p className="text-red-500 text-sm mt-1">{errors.longitude}</p>
                  )}
                </motion.div>
              </div>
            </div>
          </div>

          {/* Right Column - Map Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="h-[500px] rounded-lg overflow-hidden border border-gray-200"
          >
            {mapUrl ? (
              <iframe
                src={mapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <Map className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Enter coordinates to preview location</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-all ${isLoading
            ? 'bg-blue-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600'
            }`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Adding Location...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Add Location
            </>
          )}
        </motion.button>
      </form>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </motion.div>
  )
}

export default MapAdd