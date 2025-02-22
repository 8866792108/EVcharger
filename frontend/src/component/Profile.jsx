import React, { useState } from "react"
import { MapPin, Settings, LogOut, ListOrdered, LayoutDashboard, LogIn, User } from "lucide-react"
import { BluetoothDevices } from "./BluetoothDevices"
import ResponsiveSidebar from "./ResponsiveSidebar"
import { NavLink } from "react-router-dom"

const Profile = () => {
  const [islogin, setislogin] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState({
    username: "John Doe",
    email: "john@example.com",
    savedLocations: [
      { id: 1, name: "Home Charger", address: "123 Main St" },
      { id: 2, name: "Office Station", address: "456 Work Ave" }
    ]
  })

  return (
   <div className='home flex flex-col items-center justify-center min-h-screen'>
               {/* Horizontal Sidebar */}
               <ResponsiveSidebar />
   
               <main className="flex-1 w-full max-w-4xl p-4 md:transition-all md:duration-300">
        <div className=" max-w-screen-2xl mx-auto p-6">
          <div className=" bg-white dark:bg-black dark:text-gray-200 rounded-xl shadow-sm overflow-hidden">
            {/* Profile Header */}
            <div className="relative h-32 bg-[#db0000]">
              <div className="absolute -bottom-16 left-6">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-white">

                  {localStorage.getItem("image")
                    ? <img
                      src={"http://localhost:8080/" + localStorage.getItem("image")}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                    : <User className="w-full h-full text-black"/>
                  }
                </div>
              </div>
            </div>

            <div className="mt-16 px-6 pb-6">
              {/* Profile Info */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:bg-black dark:text-white">{localStorage.getItem('loggeduser') || "Guest"}</h2>
                  <p className="text-gray-400 dark:bg-black dark:text-white">{localStorage.getItem("user_email")}</p>
                </div>
                {islogin
                  && <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    {isEditing ? "Save Changes" : "Edit Profile"}
                  </button>
                }
                {/* <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </button> */}
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Saved Locations */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-black dark:text-white">
                    <MapPin className="h-5 w-5" />
                    Saved Locations
                  </h3>
                  {userData.savedLocations.map(location => (
                    <div key={location.id} className=" dark:bg-gray-900 dark:text-gray-200 p-4 rounded-lg bg-red-50 text-gray-800 hover:text-gray-950 hover:border hover:border-red-200 dark:hover:border dark:hover:border-gray-700">
                      <h4 className="font-medium">{location.name}</h4>
                      <p className="text-gray-400 text-sm">{location.address}</p>
                    </div>
                  ))}
                </div>

                {/* Bluetooth Devices */}
                <div className=" space-y-4">
                  <BluetoothDevices />
                </div>

                {/* Quick Actions */}
                <div className="space-y-4 md:col-span-2 text-black dark:text-gray-300">
                  <h3 className="text-lg font-semibold cursor-default">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:text-gray-200 dark:bg-gray-900 rounded-lg hover:bg-red-100 hover:font-medium hover:border hover:border-red-200 dark:hover:border dark:hover:border-gray-700">
                      <Settings className="h-5 w-5" />
                      Account Settings
                    </button>
                    <NavLink to={'/ordermanage'} className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:text-gray-200 dark:bg-gray-900 rounded-lg hover:bg-red-100 hover:font-medium hover:border hover:border-red-200 dark:hover:border dark:hover:border-gray-700">
                      <MapPin className="h-5 w-5" />
                      Order Locations
                    </NavLink>
                    <NavLink to={'/currentuser'} className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:text-gray-200 dark:bg-gray-900 rounded-lg hover:bg-red-100 hover:font-medium hover:border hover:border-red-200 dark:hover:border dark:hover:border-gray-700">
                      <LayoutDashboard className="h-5 w-5" />
                      Manage Locations
                    </NavLink>
                    {islogin
                      ? <button onClick={() => { localStorage.removeItem("token") }} className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 dark:text-gray-200 dark:bg-gray-900 rounded-lg hover:bg-red-100 hover:border hover:border-red-200 dark:hover:border dark:hover:border-gray-700">
                        <LogOut className="h-5 w-5" />
                        Logout
                      </button>
                      : <NavLink to={"/login"}  className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:text-gray-200 dark:bg-gray-900 rounded-lg hover:bg-red-100 hover:font-medium hover:border hover:border-red-200 dark:hover:border dark:hover:border-gray-700">
                        <LogIn className="h-5 w-5" />
                        Login
                      </NavLink>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


export default Profile