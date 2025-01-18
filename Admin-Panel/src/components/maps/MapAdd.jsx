import { Upload, User } from 'lucide-react'
import React, { useState } from 'react'

const MapAdd = () => {
  const [Image, setImage] = useState({
    previewurl: null,
    file: null
  })

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

  return (
    <div className='MapAdd'>
      <form action="">
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
              {/* upload */}
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
        <label htmlFor="name">Name </label>
        <input type="text" /><br /><br />
        <label htmlFor="name">Name </label>
        <input type="text" /><br /><br />
        <label htmlFor="name">Name </label>
        <input type="text" /><br /><br />
        <label htmlFor="name">Name </label>
        <input type="text" /><br /><br />
      </form>
    </div>
  )
}

export default MapAdd