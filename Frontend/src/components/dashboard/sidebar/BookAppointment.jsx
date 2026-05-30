import { useEffect, useState } from "react";
import DashHeader from "../DashHeader";
import Appointment from "./Appointment";
import { FaStar } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import InfiniteScroll from "react-infinite-scroll-component";
import api from "../../../api";
import { DoctorCardSkeleton } from "../../Skeleton";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

const BookAppointment = () => {
  const [appVisible, setAppVisible] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [visibleDoctors, setVisibleDoctors] = useState([]);
  const [page, setPage] = useState(0);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const response = await api.get(`${BACKEND}/doctors/listdoctors?page=0&limit=10`);
      setLoadingDoctors(false);
      if (response?.data?.success) {
        setVisibleDoctors(response.data.doctors);
        setTotalDoctors(response.data.totalDoctors);
        setPage((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  // Infinite Scroll: Fetch More Data
  const fetchData = async () => {
    if (visibleDoctors.length >= totalDoctors) {
      setHasMore(false);
      return;
    }
    try {
      let url = `${BACKEND}/doctors/listdoctors?page=${page}&limit=10`;
      if (visibleDoctors.length > 0) {
        const lastDoctor = visibleDoctors[visibleDoctors.length - 1];
        url = `${BACKEND}/doctors/listdoctors?page=${page}&limit=10&lastId=${lastDoctor._id}`;
      }

      const response = await api.get(url);
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
    <div className="w-full flex flex-col flex-grow bg-background font-manrope">
      <DashHeader setFilteredDoctors={setFilteredDoctors} />

      <div className="flex-1 max-w-[1280px] mx-auto w-full px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-1">Find Your Specialist</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Book appointments with top-rated doctors and specialists.
            <span className="ml-2 font-label-md text-primary-container font-semibold">
              {totalDoctors} specialists available
            </span>
          </p>
        </div>

        {/* Doctor Listing */}
        {loadingDoctors ? (
          <div className="flex flex-col gap-5">{[...Array(3)].map((_, i) => <DoctorCardSkeleton key={i} />)}</div>
        ) : (
        <InfiniteScroll
          dataLength={visibleDoctors.length}
          next={fetchData}
          hasMore={hasMore}
          loader={
            <div className="flex items-center justify-center py-8 gap-2 text-on-surface-variant font-body-md">
              <span className="material-symbols-outlined animate-spin text-primary-container">progress_activity</span>
              Loading more specialists...
            </div>
          }
          endMessage={
            <p className="text-center py-6 text-outline font-caption">All specialists loaded.</p>
          }
        >
          <div className="flex flex-col gap-5">
            {/* Display Filtered or All Doctors */}
            {(filteredDoctors.length > 0 ? filteredDoctors : visibleDoctors).length > 0 ? (
              (filteredDoctors.length > 0 ? filteredDoctors : visibleDoctors).map((item, index) => (
                <article
                  key={index}
                  className="bg-surface-container-lowest rounded-xl border border-outline-variant/50 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start"
                >
                  {/* Doctor Avatar */}
                  <div className="w-20 h-20 sm:w-32 sm:h-32 shrink-0 rounded-xl overflow-hidden border border-surface-variant bg-surface-container">
                    <img
                      src={`${item?.image}`}
                      alt={item?.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Doctor Info */}
                  <div className="flex-grow flex flex-col gap-3 min-w-0">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div>
                        <h3 className="font-headline-md text-headline-md text-on-surface">{item.name}</h3>
                        <p className="font-body-md text-body-md text-primary mt-0.5 font-medium">
                          {item.profession?.[0] || "General Practitioner"}
                        </p>
                      </div>
                      <span className="bg-tertiary-fixed text-on-tertiary-fixed font-caption text-xs px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
                        <span className="material-symbols-outlined text-[14px]">verified</span>
                        Verified
                      </span>
                    </div>

                    {/* Rating + Fee */}
                    <div className="flex items-center gap-5 flex-wrap text-on-surface-variant">
                      <div className="flex items-center gap-1">
                        <FaStar className="text-amber-400 text-sm" />
                        <span className="font-label-md text-label-md text-on-surface">{item.rating || "4.8"}</span>
                        <span className="font-caption text-caption text-outline">(67 reviews)</span>
                      </div>
                      <div className="flex items-center gap-1 font-body-md text-body-md">
                        <FaIndianRupeeSign className="text-base text-primary-container" />
                        <span className="font-semibold text-on-surface">{item.fee}</span>
                        <span className="text-outline text-sm">per consultation</span>
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="font-body-md text-sm text-on-surface-variant line-clamp-2">{item.bio}</p>

                    {/* Specialties */}
                    <div className="flex flex-wrap gap-2">
                      {item.profession?.map((p, i) => (
                        <span key={i} className="px-3 py-1 bg-surface-container text-on-surface-variant font-caption text-xs rounded-full border border-outline-variant/50">
                          {p}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-2 pt-4 border-t border-surface-container-high flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-on-surface-variant">
                        <div className="bg-secondary-fixed/20 p-1.5 rounded-full">
                          <span className="material-symbols-outlined text-base text-on-secondary-fixed-variant">calendar_clock</span>
                        </div>
                        <div>
                          <p className="font-caption text-caption text-outline">Next Available</p>
                          <p className="font-label-md text-label-md text-on-surface">Tomorrow, 9:00 AM</p>
                        </div>
                      </div>
                      <button
                        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-label-md text-label-md px-6 py-2.5 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
                        onClick={() => handleBookAppointment(item._id)}
                      >
                        <span className="material-symbols-outlined text-base">event_available</span>
                        Book Appointment
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-full py-16 flex flex-col items-center justify-center bg-surface-container-low rounded-xl border border-outline-variant/30">
                <span className="material-symbols-outlined text-5xl text-outline mb-3">person_search</span>
                <p className="font-headline-md text-on-surface-variant">No doctors found</p>
                <p className="font-body-md text-outline mt-1 text-sm">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </InfiniteScroll>
        )}
      </div>

      <Appointment onClose={handleOnClose} visible={appVisible} doctorId={selectedDoctorId} />
    </div>
  );
};

export default BookAppointment;
