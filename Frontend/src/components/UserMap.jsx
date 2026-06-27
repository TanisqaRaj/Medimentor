import "leaflet/dist/leaflet.css";
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import api from "../api";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const doctorIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

const userIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

const UserMap = ({ appointmentId, onClose }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [hasUserPos, setHasUserPos] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        // 1. Fetch doctor location
        const res = await api.get(`${BACKEND}/appointments/${appointmentId}/location`);
        const { latitude, longitude, city, state: st, pincode } = res.data.location;

        if (!latitude || !longitude) {
          setError("Doctor's location is not available yet.");
          setLoading(false);
          return;
        }

        const doctorPos = [parseFloat(latitude), parseFloat(longitude)];
        const doctorAddress = [city, st, pincode].filter(Boolean).join(", ");

        // 2. Get user geolocation (non-blocking — resolve regardless)
        const userPos = await new Promise((resolve) => {
          if (!navigator.geolocation) return resolve(null);
          navigator.geolocation.getCurrentPosition(
            (p) => resolve([p.coords.latitude, p.coords.longitude]),
            () => resolve(null),
            { enableHighAccuracy: true, timeout: 8000 }
          );
        });

        if (cancelled) return;

        setLoading(false);
        if (userPos) setHasUserPos(true);

        // 3. Wait one tick for React to paint the map div, then init Leaflet
        setTimeout(() => {
          if (cancelled || !mapRef.current || mapInstanceRef.current) return;

          const center = userPos
            ? [(doctorPos[0] + userPos[0]) / 2, (doctorPos[1] + userPos[1]) / 2]
            : doctorPos;

          const map = L.map(mapRef.current).setView(center, 13);
          mapInstanceRef.current = map;

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          }).addTo(map);

          L.marker(doctorPos, { icon: doctorIcon })
            .addTo(map)
            .bindPopup(`<b>Doctor's Location</b><br/>${doctorAddress}`)
            .openPopup();

          if (userPos) {
            L.marker(userPos, { icon: userIcon })
              .addTo(map)
              .bindPopup("<b>Your Location</b>");

            map.fitBounds(L.latLngBounds([doctorPos, userPos]), { padding: [60, 60] });

            // 4. Draw OSRM route
            fetch(
              `https://router.project-osrm.org/route/v1/driving/` +
              `${userPos[1]},${userPos[0]};${doctorPos[1]},${doctorPos[0]}` +
              `?overview=full&geometries=geojson`
            )
              .then((r) => r.json())
              .then((data) => {
                if (cancelled || !data.routes?.length) return;
                const route = data.routes[0];
                const coords = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
                L.polyline(coords, { color: "#2563eb", weight: 5, opacity: 0.8 }).addTo(map);
                map.fitBounds(L.latLngBounds(coords), { padding: [60, 60] });

                const distKm = (route.distance / 1000).toFixed(1);
                const mins = Math.round(route.duration / 60);
                const hrs = Math.floor(mins / 60);
                const eta = hrs > 0 ? `${hrs}h ${mins % 60}m` : `${mins} min`;
                if (!cancelled) setRouteInfo({ distance: `${distKm} km`, duration: eta });
              })
              .catch(() => {});
          } else {
            map.setView(doctorPos, 15);
          }
        }, 0);

      } catch {
        if (!cancelled) {
          setError("Could not load the doctor's location. Please try again.");
          setLoading(false);
        }
      }
    };

    init();
    return () => {
      cancelled = true;
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, [appointmentId]);

  const handleBackdropClick = (e) => {
    if (e.target.id === "usermap-container") onClose();
  };

  return (
    <div
      id="usermap-container"
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-[200] p-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col">

        {/* Header */}
        <div className="bg-white px-5 py-3 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-xl">📍</span>
            <span className="font-semibold text-gray-800">Appointment Location</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors text-xl leading-none">✕</button>
        </div>

        {/* Map container — always mounted so mapRef is always available */}
        <div className="relative">
          {/* Overlay shown while loading or on error */}
          {(loading || error) && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white h-[60vh]">
              {error ? (
                <p className="text-red-500 font-medium px-6 text-center">{error}</p>
              ) : (
                <>
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="text-gray-500 text-sm">Fetching location...</p>
                </>
              )}
            </div>
          )}
          {/* Map div is always in the DOM */}
          <div ref={mapRef} className="h-[60vh] w-full" />
        </div>

        {/* Footer */}
        <div className="bg-white px-5 py-3 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-full bg-blue-500" /> Your location
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-full bg-red-500" /> Doctor's location
            </span>
            {routeInfo && (
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-5 h-1 bg-blue-600 rounded" /> Route
              </span>
            )}
          </div>
          {routeInfo ? (
            <div className="flex items-center gap-4 text-sm font-medium text-gray-700">
              <span>🛣️ {routeInfo.distance}</span>
              <span>🕐 {routeInfo.duration}</span>
            </div>
          ) : hasUserPos && !loading && !error ? (
            <p className="text-xs text-gray-400">Calculating route...</p>
          ) : !hasUserPos && !loading && !error ? (
            <p className="text-xs text-gray-400">Enable location access to see route & distance.</p>
          ) : null}
        </div>

      </div>
    </div>
  );
};

export default UserMap;
