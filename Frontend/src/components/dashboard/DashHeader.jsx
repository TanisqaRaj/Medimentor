import { useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { RiArrowDropDownLine } from "react-icons/ri";
import api from "../../api";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

const DashHeader = ({ setFilteredDoctors }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isDoctor, setIsDoctor] = useState("true");
  const [searchTerm, setSearchTerm] = useState("");

  const openPopup = () => {
    setIsPopupOpen(true);
    setIsOpen(false);
    setIsDoctor("false");
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setQuery("");
    setIsDoctor("true");
  };

  const submitQuery = async () => {
    await filterDoctors();
    closePopup();
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

useEffect(() => {
  let timeoutId;
  if (searchTerm === "") {
    setFilteredDoctors([]);
  } else {
    // debouncing
    timeoutId = setTimeout(() => {
      filterDoctors();
    }, 600);
  }

  return () => {
    clearTimeout(timeoutId);
  };
}, [searchTerm]);

  const filterDoctors = async () => {
    console.log("searchTerm", searchTerm);
    if (searchTerm === "") {
      setFilteredDoctors([]);
      return;
    }
    const response = await api.get(
      `${BACKEND}/doctors/searchdoctor?query=${encodeURIComponent(searchTerm)}&isDoctor=${isDoctor}`
    );
    let success = response?.data?.success;
    if (success) {
      const newDoctors = response.data.doctors;
      if (newDoctors.length === 0) {
        const emtyDoctor = {
          name: "No doctors found",
          rating: 0,
          fee: 0,
          bio: "No doctors found",
          profession: ["No doctors found"],
        };
        setFilteredDoctors([emtyDoctor]);
      } else {
        setFilteredDoctors(newDoctors);
      }
    } else {
      setFilteredDoctors([]);
    }
  };

  return (
    <header className="h-20 flex px-6 lg:px-10 w-full z-30 bg-surface-container-lowest border-b border-outline-variant/30 font-manrope shadow-sm sticky top-0">
      <div className="h-full container mx-auto flex items-center justify-between w-full">
        <h1 className="text-2xl font-headline-md font-bold tracking-tight text-emerald-700 hidden md:block">
          Find Your Doctor
        </h1>
        
        {/*----------- SearchBar and SearchLogo ---------------*/}
        <div className="flex items-center flex-grow justify-end max-w-lg">
          <div className="flex w-full items-center bg-surface-container rounded-full border border-outline-variant/50 focus-within:ring-2 focus-within:ring-primary-container/20 focus-within:border-primary-container transition-all overflow-hidden h-12 shadow-sm">
            <div className="relative">
              <button
                className="flex items-center justify-center gap-1 bg-surface-variant hover:bg-surface-container-highest text-on-surface-variant px-4 h-full transition-colors border-r border-outline-variant/30 font-label-md"
                onClick={toggleDropdown}
              >
                <span>Filter</span>
                <RiArrowDropDownLine className="text-xl" />
              </button>

              {isOpen && (
                <div className="absolute mt-2 left-0 bg-surface-container-lowest border border-outline-variant/50 rounded-lg shadow-lg w-48 z-50 py-1 font-body-md overflow-hidden">
                  <button 
                    className="w-full text-left px-4 py-2 text-on-surface hover:bg-primary-container/10 hover:text-primary-container transition-colors" 
                    onClick={openPopup}
                  >
                    Advanced Query
                  </button>
                </div>
              )}
            </div>

            <input
              type="text"
              value={searchTerm}
              placeholder="Search doctors by name or specialty..."
              className="flex-grow h-full px-4 outline-none bg-transparent text-on-surface placeholder:text-outline font-body-md"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <button 
              className="h-full px-5 bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center justify-center"
              onClick={filterDoctors}
            >
              <IoMdSearch className="text-xl" />
            </button>
          </div>
        </div>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[100]">
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-2xl w-full max-w-md border border-outline-variant/50 font-manrope">
            <h2 className="text-xl font-headline-md font-bold text-on-surface mb-2">Write Your Query</h2>
            <p className="text-body-md text-on-surface-variant mb-4">Describe the symptoms or specialty you are looking for.</p>
            <textarea
              className="w-full h-32 p-3 bg-surface-container border border-outline-variant/50 rounded-lg outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container font-body-md text-on-surface resize-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="E.g., Cardiologist for heart palpitations..."
            ></textarea>
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-5 py-2 font-label-md bg-surface-variant text-on-surface-variant hover:bg-surface-container-highest rounded-lg transition-colors"
                onClick={closePopup}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 font-label-md bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg shadow-sm transition-colors"
                onClick={submitQuery}
              >
                Search Doctors
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default DashHeader;
