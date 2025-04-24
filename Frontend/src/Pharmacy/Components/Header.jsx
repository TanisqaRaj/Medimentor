import { TbShoppingBagSearch } from "react-icons/tb";
import { FaHospitalUser } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa6";
// import { useSelector } from "react-redux";

const Header = () => {

  // const ProductNo = useSelector((state) => state.cart.items);

  return (
    <header className="w-full h-16 shadow-xl bg-gradient-to-r from-emerald-500 to-green-700">
      <div className="h-full container mx-auto flex items-center px-4 py-3 justify-between ">

        {/*----------- SearchBar and SearchLogo ---------------*/}
        <div className="hidden lg:flex items-center w-full justify-between max-w-sm border rounded-full focus-within:shadow ">
          <input
            type="text"
            placeholder="Search Product here..."
            className="w-full h-7 pl-2 outline-none  rounded-l-full"
          ></input>
          <div className="text-lg min-w-[40px] h-7 bg-emerald-400 flex items-center justify-center rounded-r-full">
            <TbShoppingBagSearch />
          </div>
        </div>

        {/* -------------UserProfile Cart Login SideBar--------------*/}
        <div className="flex justify-between items-center gap-7 ">
          {/* ---user profile ---*/}
          <div className="text-2xl cursor-pointer">
            <FaHospitalUser />
          </div>
          {/*--- cart ---*/}
          <div
            className="text-2xl relative"
            onClick={() => alert("Ordering not available yet")}
          >
            <span>
              <FaCartPlus />
            </span>
            <div className="bg-emerald-400 text-white h-5 w-5 p-1 flex items-center justify-center rounded-full absolute -top-2 -right-3 ">
              <p className="text-xs">{ProductNo}</p>
            </div>
          </div>
          {/* ---Login button --- */}
          {/* <div>
            <button className="px-3 py-0.5 pb-1 bg-emerald-400 rounded-full text-white hover:bg-emerald-600">
              Login
            </button>
          </div> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
