import React, { useEffect, useState } from "react";
import DashHeader from "../DashHeader";
import Appointment from "./Appointment";
import { FaStar } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";

const BookAppointment = () => {
  const [appVisible, setAppVisible] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [visibleDoctors, setVisibleDoctors] = useState([]);
  const [page, setPage] = useState(0);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  useEffect(() => {
    fetchTotalDoctors();
  }, []);

  // Count Total Doctors
  const fetchTotalDoctors = async () => {
    try {
      const response = await axios.get("https://medimentorbackend.onrender.com/doctors/totaldoctors");
      const success = response?.data?.success;

      if (success) {
        const total = response.data.totalDoctors;
        setTotalDoctors(total);

        if (total > 0) {
          await fetchInitialData();
        }
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.error("Error fetching total doctors:", error);
    }
  };

  // Fetch Initial Data
  const fetchInitialData = async () => {
    try {
      const response = await axios.get("https://medimentorbackend.onrender.com/doctors/listdoctors?page=0&limit=10");
      const success = response?.data?.success;

      if (success) {
        setVisibleDoctors(response.data.doctors);
        setPage((prev) => prev + 1);
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.error(" Error fetching initial data:", error);
    }
  };

  // Infinite Scroll: Fetch More Data
  const fetchData = async () => {
    if (visibleDoctors.length >= totalDoctors) {
      setHasMore(false);
      return;
    }
    try {
      let url = `https://healthcare-platform-server.vercel.app/doctors/listdoctors?page=${page}&limit=10`;
      if (visibleDoctors.length > 0) {
        const lastDoctor = visibleDoctors[visibleDoctors.length - 1];
        url = `https://healthcare-platform-server.vercel.app/doctors/listdoctors?page=${page}&limit=10&lastId=${lastDoctor._id}`;
      }

      const response = await axios.get(url);
      const success = response?.data?.success;

      if (success) {
        setVisibleDoctors((prev) => [...prev, ...response.data.doctors]);
        setPage((prev) => prev + 1);
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.error(" Error fetching more data:", error);
    }
  };

  const handleBookAppointment = (doctorId) => {
    setSelectedDoctorId(doctorId);
    setAppVisible(true);
  };

  const handleOnClose = () => setAppVisible(false);

  return (
    <div className="w-full overflow-hidden">
      <DashHeader setFilteredDoctors={setFilteredDoctors} />
      <div className="pb-5 px-10 py-10">
        <InfiniteScroll
          dataLength={visibleDoctors.length}
          next={fetchData}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
        >
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6 px-4 lg:px-14">
            {/* Display Filtered Doctors if Available */}
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((item, index) => (
                <div key={index} className="flex flex-row items-center bg-white border rounded-lg shadow-lg hover:shadow-2xl duration-300 p-4">
                  <div className="hidden sm:block">
                    <img
                      src={`data:image/jpeg;base64,${item?.image}`} // Fixed: Use JPEG since Sharp outputs JPEG
                      alt={item?.name}
                      style={{ height: "250px", width: "350px", objectFit: "cover" }}
                      className="border w-30 h-30 object-cover rounded-3xl shadow-lg hover:scale-105 duration-300"
                    />
                  </div>
                  <div className="items-start pl-10 space-y-4">
                    <div className="text-2xl font-semibold text-gray-800">{item.name}</div>
                    <div className="flex gap-6">
                      <div className="flex items-center justify-center gap-2">
                        <FaStar />
                        <div className="text-gray-800">{item.rating}</div>
                        <div className="text-gray-600">67 reviews</div>
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <FaIndianRupeeSign />
                        <div className="font-semibold text-gray-800">{item.fee}</div>
                        <div className="text-gray-600">per consultation</div>
                      </div>
                    </div>
                    <div className="w-full text-sm text-gray-600 text-left mt-2">{item.bio}</div>
                    <div className="flex flex-col sm:flex-row gap-2 text-center text-gray-700">
                      {item.profession.map((profession, index) => (
                        <p key={index} className="border bg-slate-200 rounded-lg p-1">
                          {profession}
                        </p>
                      ))}
                    </div>
                    <button
                      className="mt-4 bg-emerald-500 text-white items-center py-2 px-6 rounded-lg hover:bg-emerald-700 duration-300"
                      onClick={() => handleBookAppointment(item._id)}
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              ))
            ) : visibleDoctors.length > 0 ? (
              visibleDoctors.map((item, index) => (
                <div key={index} className="flex flex-row items-center bg-white border rounded-lg shadow-lg hover:shadow-2xl duration-300 p-4">
                  <div className="hidden sm:block">
                    <img
                      src={`data:image/jpeg;base64,${item?.image}`} 
                      alt={item?.name}
                      style={{ height: "250px", width: "350px", objectFit: "cover" }}
                      className="border w-30 h-30 object-cover rounded-3xl shadow-lg hover:scale-105 duration-300"
                    />
                  </div>
                  <div className="items-start pl-10 space-y-4">
                    <div className="text-2xl font-semibold text-gray-800">{item.name}</div>
                    <div className="flex gap-6">
                      <div className="flex items-center justify-center gap-2">
                        <FaStar />
                        <div className="text-gray-800">{item.rating}</div>
                        <div className="text-gray-600">67 reviews</div>
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <FaIndianRupeeSign />
                        <div className="font-semibold text-gray-800">{item.fee}</div>
                        <div className="text-gray-600">per consultation</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 text-center mt-2">{item.bio}</div>
                    <div className="flex flex-col sm:flex-row gap-2 text-center text-gray-700">
                      {item.profession.map((profession, index) => (
                        <p key={index} className="border bg-slate-200 rounded-lg p-1">
                          {profession}
                        </p>
                      ))}
                    </div>
                    <button
                      className="mt-4 bg-emerald-500 text-white items-center py-2 px-6 rounded-lg hover:bg-emerald-700 duration-300"
                      onClick={() => handleBookAppointment(item._id)}
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No doctors found</p>
            )}
          </div>
        </InfiniteScroll>
      </div>
      <Appointment onClose={handleOnClose} visible={appVisible} doctorId={selectedDoctorId} />
    </div>
  );
};

export default BookAppointment;