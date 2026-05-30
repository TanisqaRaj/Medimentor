import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import api from "../api";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

const UserMap = ({ appointmentId, onClose }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const [locationText, setLocationText] = useState("Fetching location...");
  const [, setPosition] = useState(null);

  // Step 1: Get doctor's location from backend
  const fetchDoctorLocation = async () => {
    try {
      const res = await api.get(`${BACKEND}/appointments/${appointmentId}/location`);
      const { latitude, longitude } = res.data.location;

      if (latitude && longitude) {
        const pos = [latitude, longitude];
        setPosition(pos);
        fetchLocationDetails(latitude, longitude); // Step 2: Get address
        renderMap(pos);
      } else {
        setLocationText("Doctor's location not found");
      }
    } catch (err) {
      console.error("API Error:", err);
      setLocationText("Error fetching location from backend");
    }
  };

  // Step 2: Use reverse geocoding to get readable address
  const fetchLocationDetails = async (lat, lon) => {
    try {
      const res = await api.get("https://nominatim.openstreetmap.org/reverse", {
        params: {
          format: "json",
          lat: lat,
          lon: lon,
        },
      });

      const data = res.data;
      if (data.address) {
        const { city, town, village, state, postcode } = data.address;
        setLocationText(
          `${city || town || village || "Unknown"}, ${state || "Unknown"}, ${
            postcode || "Unknown"
          }, Lat: ${lat}, Lon: ${lon}`
        );
      } else {
        setLocationText("Address not found");
      }
    } catch (err) {
      console.error("Reverse geocoding error:", err);
      setLocationText("Error getting address");
    }
  };

  // Step 3: Render map
  const renderMap = (pos) => {
    if (!mapRef.current) return;

    mapInstanceRef.current = L.map(mapRef.current).setView(pos, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(mapInstanceRef.current);

    markerRef.current = L.marker(pos).addTo(mapInstanceRef.current);
  };

  useEffect(() => {
    fetchDoctorLocation();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, []);

  const handleOnClose = (e) => {
    if (e.target.id === "container") onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
      id="container"
      onClick={handleOnClose}
    >
      <div>
        <div
          className="h-[70vh] w-[70vw] flex rounded-t-lg bg-white overflow-hidden"
          ref={mapRef}
        ></div>
        <div className="flex justify-center shadow-lg">
          <textarea
            className="w-[70vw] rounded-b-lg p-2 text-gray-800"
            readOnly
            value={locationText}
          />
        </div>
      </div>
    </div>
  );
};

export default UserMap;
