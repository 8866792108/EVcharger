import React, { useState } from "react"
import { Bluetooth, Battery, AlertCircle } from "lucide-react"

export const BluetoothDevices = () => {
  const [devices, setDevices] = useState([{}])
  const [isScanning, setIsScanning] = useState(false)

  const scanDevices = async () => {
    setIsScanning(true)
    // Mock bluetooth scanning
    setTimeout(() => {
      setDevices([
        {
          id: "1",
          name: "EV Bike Pro",
          batteryLevel: 75,
          batteryHealth: 92,
          lastCharged: "2h ago",
          isConnected: true
        },
        {
          id: "2",
          name: "Smart Scooter",
          batteryLevel: 45,
          batteryHealth: 88,
          lastCharged: "5h ago",
          isConnected: false
        }
      ])
      setIsScanning(false)
    }, 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Bluetooth className="h-5 w-5 text-blue-500" />
          Connected Devices
        </h3>
        <button
          onClick={scanDevices}
          disabled={isScanning}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {isScanning ? "Scanning..." : "Scan"}
        </button>
      </div>

      <div className="space-y-4">
        {devices.map(device => (
          <div
            key={device.id}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    device.isConnected ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
                <h4 className="font-medium">{device.name}</h4>
              </div>
              <Battery
                className={`h-6 w-6 ${
                  device.batteryLevel > 50
                    ? "text-green-500"
                    : "text-yellow-500"
                }`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Battery Level</p>
                <div className="mt-1 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${device.batteryLevel}%` }}
                  />
                </div>
                <p className="mt-1 text-sm font-medium">
                  {device.batteryLevel}%
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Battery Health</p>
                <div className="mt-1 h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${device.batteryHealth}%` }}
                  />
                </div>
                <p className="mt-1 text-sm font-medium">
                  {device.batteryHealth}%
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-gray-600">
                Last charged: {device.lastCharged}
              </span>
              <button className="text-blue-500 hover:text-blue-600">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {devices.length === 0 && !isScanning && (
        <div className="text-center py-8">
          <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">
            No devices found. Click scan to search for nearby devices.
          </p>
        </div>
      )}
    </div>
  )
}
