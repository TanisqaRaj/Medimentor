import "leaflet/dist/leaflet.css";
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { MdAddLocationAlt } from "react-icons/md";

const Map = ({ onclose, position, setPosition, appointmentId, appointmentState, updateAppointmentStatus}) => {
  const mapRef = useRef(null);
  const mapRefInstance = useRef(null); // Store map instance
  const markerRef = useRef(null);
  
  const [locationText, setLocationText] = useState("Your location...");

  const handleOnClose = (e) => {
    if (e.target.id === "container") onclose();
  };

  const onSubmit = async () => {
    await updateAppointmentStatus(appointmentId, appointmentState, null, null, locationText);
    console.log(locationText);
    onclose();
  };

  const fetchLocationDetails = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();

      if (data.address) {
        console.log(data.address);
        const city =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          "Unknown City";
        const state = data.address.state || "Unknown State";
        const pincode = data.address.postcode || "Unknown Pincode";

        // Update the textarea with city, state, and pincode
        setLocationText(`${city}, ${state}, ${pincode}`);
      } else {
        setLocationText("Location not found");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      setLocationText("Error fetching location");
    }
  };

  const setLocation = () => {
    console.log(position);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (location) => {
          const userPos = [location.coords.latitude, location.coords.longitude];
          setPosition(userPos);

          // Fetch city, state, and pincode
          await fetchLocationDetails(userPos[0], userPos[1]);

          // Use mapRefInstance.current instead of undefined map variable
          if (mapRefInstance.current) {
            mapRefInstance.current.setView(userPos, 13); // Move map to user's location
          }

          if (markerRef.current) {
            markerRef.current.setLatLng(userPos); // Ensure marker exists before setting
          }
        },
        (error) => {
          console.error("Geolocation error:", error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize the map and store it in the ref
    mapRefInstance.current = L.map(mapRef.current).setView(position, 13);

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapRefInstance.current);

    // Create a draggable marker
    markerRef.current = L.marker(position, { draggable: true }).addTo(
      mapRefInstance.current
    );

    // Update state when marker is dragged
    markerRef.current.on("dragend",async function (event) {
      const newPos = event.target.getLatLng();
      setPosition([newPos.lat, newPos.lng]);
      await fetchLocationDetails(newPos.lat, newPos.lng);
    });

    // Geolocation API - Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (location) => {
          const userPos = [location.coords.latitude, location.coords.longitude];
          setPosition(userPos);
          mapRefInstance.current.setView(userPos, 13); // Move map to user's location
          if (markerRef.current) markerRef.current.setLatLng(userPos); // Ensure marker exists before setting
        },
        (error) => {
          console.error("Geolocation error:", error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

    return () => {
      mapRefInstance.current.remove(); // Cleanup map on unmount
    };
  }, []); // Empty dependency array ensures it runs only once

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
      id="container"
      onClick={handleOnClose}
    >
      <div>
        <div
          className="h-[70vh] w-[70vw] flex rounded-t-lg bg-white  overflow-auto"
          ref={mapRef}
        ></div>
        <div className="flex justify-center  shadow-lg">
          <textarea className="w-[58vw] rounded-b-lg" value={locationText}>
            {/* your location.... */}
          </textarea>
          <button
            className="w-[2vw] items-center justify-center text-emerald-300 bg-white rounded-b-lg font-bold text-xl"
            onClick={setLocation}
           
          >
            <MdAddLocationAlt />
       
          </button>
          <button
            className="w-[10vw] items-center justify-center text-emerald-300 bg-white rounded-b-lg font-bold text-xl"
            
            onClick={onSubmit}
          >
            submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Map;
