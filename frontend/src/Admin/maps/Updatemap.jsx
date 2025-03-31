import { Upload, User, MapPin, Send, Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { motion } from 'framer-motion'

const Updatemap = ({ url }) => {
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
  const [isFetching, setIsFetching] = useState(true)
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      setIsFetching(true)
      const response = await axios.get(`${url}/slots/find/${id}`)

      setmapinfo({
        name: response.data.name,
        address: response.data.address,
        latitude: response.data.latitude,
        longitude: response.data.longitude
      })

      if (response.data.image) {
        setImage(prev => ({
          ...prev,
          previewurl: response.data.image
        }))
      }
    } catch (error) {
      toast.error("Failed to fetch location details")
      console.error("Error fetching data:", error)
      navigate('/Admin/maps/display')
    } finally {
      setIsFetching(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setmapinfo(prev => ({ ...prev, [name]: value }))
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
    } else {
      toast.error("Please upload a valid image file (PNG or JPEG)")
      setImage(prev => ({ ...prev, file: null }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const formdata = new FormData()
    Object.keys(mapinfo).forEach(key => {
      formdata.append(key, mapinfo[key])
    })
    if (Image.file) {
      formdata.append("image", Image.file)
    }

    try {
      const response = await axios.post(`${url}/slots/setitems/${id}`, formdata, {
        headers: { "Content-Type": "multipart/form-data" }
      })

      if (response.data.success) {
        toast.success(response.data.message || "Location Updated Successfully")
        navigate('/Admin/maps/display')
      }
    } catch (error) {
      toast.error("Failed to update location")
      console.error("Error updating location:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center min-h-screen"
      >
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg"
    >
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-800 mb-6"
      >
        Update Location
      </motion.h2>

      <form onSubmit={handleSubmit} className="space-y-6">
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
                  src={`${url}/${Image.previewurl}`}
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
        </motion.div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              onChange={handleChange}
              value={mapinfo.name}
              name="name"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter location name"
            />
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
              onChange={handleChange}
              value={mapinfo.address}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-24 resize-none"
              placeholder="Enter full address"
            />
          </motion.div>

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
                onChange={handleChange}
                value={mapinfo.latitude}
                name="latitude"
                required
                step="any"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter latitude"
              />
            </div>
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
                onChange={handleChange}
                value={mapinfo.longitude}
                name="longitude"
                required
                step="any"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter longitude"
              />
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={() => navigate('/Admin/maps/display')}
            className="flex-1 py-3 px-4 rounded-lg text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className={`flex-1 py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-all ${isLoading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
              }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Update Location
              </>
            )}
          </motion.button>
        </div>
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

export default Updatemap
