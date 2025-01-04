import React, { useState } from "react"
import { Bluetooth, Battery, AlertCircle } from "lucide-react"

export const BluetoothDevices = () => {
  const [devices, setDevices] = useState([{}])
  const [isScanning, setIsScanning] = useState(false)

  const [deviceName, setDeviceName] = useState(null);
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [error, setError] = useState(null);

  const connectToAirbuds = async () => {
    try {
      setIsScanning(false)
      setError(null);

      // Request to pair with the earbuds
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true, // Adjust as needed
        optionalServices: ["battery_service"], // Request the Battery Service
      });

      setDeviceName(device.name || "Unnamed Device");

      // Connect to the earbuds' GATT server
      const server = await device.gatt.connect();

      // Attempt to access the Battery Service
      const service = await server.getPrimaryService("battery_service");

      // Get the battery level characteristic
      const characteristic = await service.getCharacteristic("battery_level");

      // Read the battery level value
      const value = await characteristic.readValue();
      const batteryPercentage = value.getUint8(0); // First byte is the battery level (0–100)

      setBatteryLevel(`${batteryPercentage}%`);
    } catch (err) {
      setError("Unable to connect or retrieve data. Make sure the earbuds support the Battery Service.");
      console.error(err);
    }
  };



  const scanDevices = async () => {
    setIsScanning(true)
    // Mock bluetooth scanning
    connectToAirbuds()
    setIsScanning(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-black dark:text-gray-200">
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
        {deviceName &&
          <div
            className="bg-red-100 dark:bg-gray-900 p-4 rounded-xl shadow-sm hover:border hover:border-red-200 dark:hover:border dark:hover:border-gray-700"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${deviceName ? "bg-green-500" : "bg-black"
                    }`}
                />
                <h4 className="font-medium text-gray-900 dark:text-gray-50 ">{deviceName}</h4>
              </div>
              {batteryLevel !== null && (
                <Battery
                  className={`h-7 w-7 ${batteryLevel > 50
                    ? "text-green-500"
                    : "text-yellow-500"
                    }`}
                />
              )}
            </div>

            {batteryLevel && (
              <div className="grid gap-4">
                <div>
                  <p className="text-sm text-gray-600">Battery Level</p>
                  <div className="mt-1 h-2 w-full border border-green-500 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{width:batteryLevel}}
                    />
                  </div>
                  <p className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {batteryLevel}
                  </p>
                </div>
              </div>
            )}

            {/* <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-gray-600">
                Last charged: {device.lastCharged}
              </span>
              <button className="text-blue-500 hover:text-blue-600">
                View Details
              </button>
            </div> */}
          </div>
        }
      </div>

      {error && (
        <div className="text-center py-8">
          <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">
            No devices found. Click scan to search for nearby devices.
            <p>{error}</p>
          </p>
        </div>
      )}
    </div>
  )
}
