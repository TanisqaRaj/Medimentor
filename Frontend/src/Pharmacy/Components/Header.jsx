import { TbShoppingBagSearch } from "react-icons/tb";
import { FaHospitalUser } from "react-icons/fa";
import { FaCartPlus } from "react-icons/fa6";

const Header = () => {
  return (
    <header className="w-full sticky top-[72px] z-40 bg-white/90 backdrop-blur-md border-b border-outline-variant/40 shadow-sm font-manrope">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center px-4 md:px-6 py-3 gap-3 md:gap-4">
        
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary-container text-base">local_pharmacy</span>
            </div>
            <span className="font-headline-md text-on-surface text-base font-bold">Pharmacy</span>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <button className="p-2 text-on-surface-variant hover:text-primary transition-all">
              <FaCartPlus className="text-xl" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="w-full md:flex-grow md:max-w-md">
          <div className="flex items-center bg-surface-container rounded-full border border-outline-variant/50 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
            <input
              type="text"
              placeholder="Search products, medicines..."
              className="flex-grow bg-transparent px-4 py-2 text-on-surface text-sm outline-none placeholder:text-outline w-full"
            />
            <div className="flex items-center justify-center w-10 h-10 text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
              <TbShoppingBagSearch className="text-xl" />
            </div>
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-all">
            <FaHospitalUser className="text-xl" />
          </button>
          <button
            className="relative p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-all"
            onClick={() => alert("Ordering not available yet")}
          >
            <FaCartPlus className="text-xl" />
            <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">0</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;