import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Edit2, Trash2, Loader2, Search, ArrowUpDown, Plus, Map, Download, CheckSquare, XSquare, Filter, Sliders } from 'lucide-react'

const Displaymap = ({ url }) => {
  const [map, setmap] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [selectedLocations, setSelectedLocations] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: 'all',
    type: 'all',
    minLat: '',
    maxLat: '',
    minLong: '',
    maxLong: '',
    maxDistance: '',
    centerLat: '',
    centerLong: ''
  })
  const [categories] = useState([
    { id: 'all', name: 'All Categories' },
    { id: 'Bajaj', name: 'Bajaj' },
    { id: 'SMC', name: 'SMC' }
  ])
  const [types] = useState([
    { id: 'all', name: 'All Types' },
    { id: 'Bikes', name: 'Bikes' },
    { id: 'Cars', name: 'Cars' }
  ])
  const [sortOptions] = useState([
    { key: 'name', label: 'Name' },
    { key: 'address', label: 'Address' },
    { key: 'latitude', label: 'Latitude' },
    { key: 'longitude', label: 'Longitude' }
  ])

  const getmaps = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${url}/slots/getitems`)
      if (response.data.success) {
        setmap(response.data.data)
      }
    } catch (error) {
      toast.error("Failed to fetch locations")
      console.error("Error fetching locations:", error)
    } finally {
      setLoading(false)
    }
  }

  const removemap = async (slotid) => {
    try {
      const response = await axios.post(`${url}/slots/remove/${slotid}`)
      if (response.data.success) {
        toast.success(response.data.message)
        getmaps()
        setDeleteConfirm(null)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error("Failed to remove location")
      console.error("Error removing location:", error)
      setDeleteConfirm(null)
    }
  }

  useEffect(() => {
    getmaps()
  }, [])

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const resetFilters = () => {
    setFilters({
      category: 'all',
      type: 'all',
      minLat: '',
      maxLat: '',
      minLong: '',
      maxLong: '',
      maxDistance: '',
      centerLat: '',
      centerLong: ''
    })
  }

  const filteredAndSortedMaps = [...map]
    .filter(location => {
      // Search term filter
      const matchesSearch =
        location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.address.toLowerCase().includes(searchTerm.toLowerCase())

      // Category filter
      const matchesCategory =
        filters.category === 'all' || location.category === filters.category

      // Type filter
      const matchesType =
        filters.type === 'all' || location.type === filters.type

      // Coordinate range filter
      const matchesLat =
        (!filters.minLat || location.latitude >= parseFloat(filters.minLat)) &&
        (!filters.maxLat || location.latitude <= parseFloat(filters.maxLat))

      const matchesLong =
        (!filters.minLong || location.longitude >= parseFloat(filters.minLong)) &&
        (!filters.maxLong || location.longitude <= parseFloat(filters.maxLong))

      // Distance filter
      const matchesDistance =
        !filters.maxDistance || !filters.centerLat || !filters.centerLong ||
        calculateDistance(
          location.latitude,
          location.longitude,
          parseFloat(filters.centerLat),
          parseFloat(filters.centerLong)
        ) <= parseFloat(filters.maxDistance)

      return matchesSearch && matchesCategory && matchesType && matchesLat && matchesLong && matchesDistance
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0
      if (sortConfig.direction === 'asc') {
        return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1
      }
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1
    })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  const handleSelectAll = () => {
    if (selectedLocations.length === filteredAndSortedMaps.length) {
      setSelectedLocations([])
    } else {
      setSelectedLocations(filteredAndSortedMaps.map(loc => loc._id))
    }
  }

  const handleSelectLocation = (id) => {
    setSelectedLocations(prev =>
      prev.includes(id)
        ? prev.filter(locId => locId !== id)
        : [...prev, id]
    )
  }

  const handleBulkDelete = async () => {
    try {
      const promises = selectedLocations.map(id =>
        axios.post(`${url}/slots/remove/${id}`)
      )
      await Promise.all(promises)
      toast.success("Selected locations deleted successfully")
      getmaps()
      setSelectedLocations([])
    } catch (error) {
      toast.error("Failed to delete some locations")
      console.error("Error in bulk delete:", error)
    }
  }

  const handleExport = () => {
    const data = filteredAndSortedMaps.map(loc => ({
      name: loc.name,
      address: loc.address,
      latitude: loc.latitude,
      longitude: loc.longitude
    }))

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'locations.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-7xl mx-auto"
    >
      {/* Header Section */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Location Management</h1>
          <div className="flex gap-4 mt-4 md:mt-0">
            {selectedLocations.length > 0 && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                Delete Selected ({selectedLocations.length})
              </motion.button>
            )}
            <NavLink
              to="/Admin/maps/add"
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add New Location
            </NavLink>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Download className="w-5 h-5" />
              Export
            </button>
            <div className="relative">
              <select
                value={sortConfig.key || ''}
                onChange={(e) => handleSort(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="">Sort By</option>
                {sortOptions.map(option => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                    {sortConfig.key === option.key && ` (${sortConfig.direction === 'asc' ? '↑' : '↓'})`}
                  </option>
                ))}
              </select>
              <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button
              onClick={getmaps}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </motion.div>

      {/* Filters Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Filter className="w-5 h-5" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-white rounded-lg shadow-md"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {types.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="minLat"
                      placeholder="Min"
                      value={filters.minLat}
                      onChange={handleFilterChange}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      name="maxLat"
                      placeholder="Max"
                      value={filters.maxLat}
                      onChange={handleFilterChange}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="minLong"
                      placeholder="Min"
                      value={filters.minLong}
                      onChange={handleFilterChange}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      name="maxLong"
                      placeholder="Max"
                      value={filters.maxLong}
                      onChange={handleFilterChange}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Distance from Point (km)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="maxDistance"
                      placeholder="Max Distance"
                      value={filters.maxDistance}
                      onChange={handleFilterChange}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      name="centerLat"
                      placeholder="Center Lat"
                      value={filters.centerLat}
                      onChange={handleFilterChange}
                      className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Center Longitude
                  </label>
                  <input
                    type="number"
                    name="centerLong"
                    placeholder="Center Longitude"
                    value={filters.centerLong}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={resetFilters}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Loading State */}
      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center min-h-[400px]"
        >
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </motion.div>
      ) : (
        /* Location Grid */
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="wait">
            {filteredAndSortedMaps.map((location, index) => (
              <motion.div
                key={location._id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Location Image */}
                <div className="relative h-48">
                  <img
                    src={`${url}/${location.image}`}
                    alt={location.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => handleSelectLocation(location._id)}
                      className={`p-2 rounded-full transition-colors ${selectedLocations.includes(location._id)
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-gray-500 hover:bg-gray-600'
                        } text-white`}
                    >
                      {selectedLocations.includes(location._id) ? (
                        <CheckSquare className="w-4 h-4" />
                      ) : (
                        <XSquare className="w-4 h-4" />
                      )}
                    </button>
                    <NavLink
                      to={`/Admin/edit-map/${location._id}`}
                      className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </NavLink>
                    <button
                      onClick={() => setDeleteConfirm(location._id)}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Location Details */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {location.name}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {location.address}
                  </p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Lat: {location.latitude}</span>
                    <span>Long: {location.longitude}</span>
                  </div>
                  <button
                    onClick={() => setSelectedLocation(location)}
                    className="mt-4 text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center gap-1"
                  >
                    <Map className="w-4 h-4" />
                    View on Map
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Location Details Modal */}
      <AnimatePresence>
        {selectedLocation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-2xl w-full"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  {selectedLocation.name}
                </h3>
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XSquare className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={`${url}/${selectedLocation.image}`}
                    alt={selectedLocation.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      <span className="font-medium">Address:</span> {selectedLocation.address}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Latitude:</span> {selectedLocation.latitude}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Longitude:</span> {selectedLocation.longitude}
                    </p>
                  </div>
                </div>
                <div className="h-[300px] rounded-lg overflow-hidden border border-gray-200">
                  <iframe
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyCYEASBpWyQMhR75YNsWrcuPDwetlpk0Dc&q=${selectedLocation.latitude},${selectedLocation.longitude}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <NavLink
                  to={`/Admin/edit-map/${selectedLocation._id}`}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Edit Location
                </NavLink>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Confirm Delete
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this location? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => removemap(deleteConfirm)}
                  className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!loading && filteredAndSortedMaps.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No Locations Found
          </h3>
          <p className="text-gray-600">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Add your first location to get started"}
          </p>
        </motion.div>
      )}

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

export default Displaymap