import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import axios from "axios";

const EVSlots = () => {
  const [evSlots, setEvSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [interval, setInterval] = useState("30");

  useEffect(() => {
    axios.get("http://localhost:8080/slots/getitems")
      .then((response) => {
        if (response.data?.success && Array.isArray(response.data.data)) {
          setEvSlots(response.data.data);
        } else {
          setEvSlots([]);
          console.error("Unexpected response format", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching EV slots:", error);
        setEvSlots([]);
      });
  }, []);

  const handleSlotClick = (slot) => {
    if (!slot?.start || !slot?.end) {
      console.error("Invalid slot data", slot);
      return;
    }
    setSelectedSlot(slot);
    fetchAvailableSlots(slot);
  };

  const fetchAvailableSlots = (slot) => {
    axios
      .post("http://localhost:8080/orders/api/available-slots", {
        startTime: slot.start,
        endTime: slot.end,
        interval: parseInt(interval, 10),
      })
      .then((response) => {
        if (response.data?.success && Array.isArray(response.data.data)) {
          setAvailableSlots(response.data.data);
        } else {
          setAvailableSlots([]);
          console.error("Unexpected available slots format", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching available slots:", error);
        setAvailableSlots([]);
      });
  };

  const handleBooking = (slot) => {
    axios.post("http://localhost:8080/orders/api/book-slot", { start: slot.start, end: slot.end })
      .then(() => {
        alert("Slot booked successfully");
        fetchAvailableSlots(selectedSlot);
      })
      .catch((error) => {
        console.error("Error booking slot:", error);
      });
  };

  return (
    <div className="flex h-screen p-4">
      {/* Left Sidebar (EV Slots List) */}
      <div className="w-1/3 p-2 border-r overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">EV Slots</h2>
        {evSlots.length > 0 ? (
          evSlots.map((slot) => (
            <Card key={slot._id} className="mb-2 cursor-pointer" onClick={() => handleSlotClick(slot)}>
              <CardContent>
                <h3 className="text-lg font-semibold">{slot.name}</h3>
                <p className="text-sm text-gray-600">{slot.address}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-500">No EV slots available</p>
        )}
      </div>

      {/* Right Section (Available Slots & Filter) */}
      <div className="w-2/3 p-4">
        {selectedSlot && (
          <Dialog open={true} onOpenChange={() => setSelectedSlot(null)}>
            <DialogContent>
              <DialogTitle>Available Slots</DialogTitle>
              <Select value={interval} onValueChange={setInterval} className="mb-4">
                <SelectTrigger>
                  <SelectValue placeholder="Select Interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20">20 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                </SelectContent>
              </Select>
              <div>
                {availableSlots.length > 0 ? (
                  availableSlots.map((slot, index) => (
                    <Card key={index} className="mb-2">
                      <CardContent className="flex justify-between items-center">
                        <span>
                          {slot.start} - {slot.end}
                        </span>
                        <Button onClick={() => handleBooking(slot)}>Book</Button>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-500">No available slots</p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default EVSlots;
