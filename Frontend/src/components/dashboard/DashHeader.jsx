import { useEffect, useState } from "react";
import { IoMdSearch } from "react-icons/io";
import { RiArrowDropDownLine } from "react-icons/ri";
import axios from "axios";

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
    }, 2000);
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
    const response = await axios.get(
      `https://healthcare-platform-server.vercel.app/doctors/searchdoctor?query=${searchTerm}&isDoctor=${isDoctor}`
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
      alert("something went wrong");
      setFilteredDoctors([]);
    }
  };

  return (
    <header className="h-16 flex px-10  w-[95vw]  right-0 z-50">
      <div className="h-full  container mx-auto flex items-center px-4 py-4 justify-center">
        <p className="px-4 pt-10 lg:px-10 pb-10 text-2xl font-bold text-gray-700 text-start hidden md:block">
          Find Your Doctor
        </p>
        {/*----------- SearchBar and SearchLogo ---------------*/}
        <div className="flex  items-center flex-grow justify-end max-w-sm border rounded-full hover:border-emerald-500 ">
          <div className="relative">
            <div
              className="flex items-center cursor-pointer rounded-l-full bg-gray-300 p-1 h-10 text-gray-700 hover:text-teal-600"
              onClick={toggleDropdown}
            >
              <div>Filter</div>
              <RiArrowDropDownLine className="ml-1" />
            </div>

            {isOpen && (
              <div className="absolute mt-2 bg-white border rounded shadow-lg w-48 z-10">
                <ul className="py-2">
                  <li className="px-4 py-2 hover:bg-teal-100">
                    <div className="hover:cursor-pointer" onClick={openPopup}>
                      Write query
                    </div>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <input
            type="text"
            value={searchTerm}
            placeholder="Search Doctor here..."
            className="w-full h-10 pl-2 outline-none rounded-l-full"
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          ></input>
          <div 
          className="text-lg min-w-[40px] h-10 bg-emerald-400 flex items-center justify-center rounded-r-full">
            <IoMdSearch />
          </div>
        </div>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Write Your Query</h2>
            <textarea
              className="w-full h-24 p-2 border rounded-lg outline-none"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              placeholder="Type your query here..."
            ></textarea>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded-lg mr-2"
                onClick={closePopup}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg"
                onClick={submitQuery}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default DashHeader;
