import React from "react";
import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Logo from "../../assets/images/logo2.jpg";
import { RiArrowDropDownLine } from "react-icons/ri";
import { GiHamburgerMenu } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../reduxslice/AuthSlice";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const doctor = useSelector((state) => state.auth.doctor);
  const token = useSelector((state) => state.auth.accessToken);
  const handleLogout = async () => {
    try { await api.post("/auth/logout"); } catch {}
    dispatch(logout());
    navigate("/");
  };
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const expirytoken = async () => {
    const tokenObj = {
      token: token,
    };
    if (token) {
      axios
        .post(import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/auth/verify-token` : "http://localhost:8080/auth/verify-token", tokenObj)
        .then((response) => {
          if (response.data.success) {
            response.data.user.role === "user"
              ? navigate("/dashboard")
              : navigate("/doctordashboard");
          } else {
            dispatch(logout());
            navigate("/"); //change it to protected route
          }
        });
    } else {
      return;
    }
  };
  useEffect(() => {
    expirytoken();
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <header className="w-full z-10 border-b border-gray-100 bg-white shadow-[0_10px_25px_-5px_rgba(4,120,87,0.05)] font-manrope text-sm tracking-tight">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        {/* Logo & Main Nav */}
        <div className="flex items-center gap-8">
          <div className="flex items-center hidden md:block">
            <img alt="Logo" className="h-10" height={150} src="https://res.cloudinary.com/dzfftyy42/image/upload/f_auto,q_auto/v1/initial%20Img/kidunrkrjfvaiubzr5lv" width={50} />
          </div>
          
          <nav className="hidden md:flex gap-6 items-center">
            <a
              className="text-slate-600 font-medium hover:text-emerald-600 transition-colors duration-200 active:scale-95 transition-transform duration-150 cursor-pointer"
              onClick={() => { handleLogout(); navigate("/"); }}
            >
              Home
            </a>
            <a
              className="text-slate-600 font-medium hover:text-emerald-600 transition-colors duration-200 active:scale-95 transition-transform duration-150 cursor-pointer"
              onClick={() => navigate("/about")}
            >
              About
            </a>
            <div className="relative">
              <div
                className="flex items-center cursor-pointer text-slate-600 font-medium hover:text-emerald-600 transition-colors duration-200 active:scale-95 transition-transform duration-150"
                onClick={toggleDropdown}
              >
                <span>Services</span>
                <RiArrowDropDownLine className="ml-1 text-lg" />
              </div>

              {isOpen && (
                <div className="absolute top-full mt-2 bg-white border border-gray-100 rounded-lg shadow-lg w-48 z-[100] overflow-hidden">
                  <ul className="py-2">
                    <li className="px-4 py-2 hover:bg-emerald-50 transition-colors">
                      <a className="text-slate-700 hover:text-emerald-700 block w-full" href="/appointment">Appointment</a>
                    </li>
                    <li className="px-4 py-2 hover:bg-emerald-50 transition-colors">
                      <a className="text-slate-700 hover:text-emerald-700 block w-full" href="/pharmacy">Pharmacy</a>
                    </li>
                    <li className="px-4 py-2 hover:bg-emerald-50 transition-colors">
                      <a className="text-slate-700 hover:text-emerald-700 block w-full" href="/chatbot">Chatbot</a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <a
              className="text-slate-600 font-medium hover:text-emerald-600 transition-colors duration-200 active:scale-95 transition-transform duration-150 cursor-pointer"
              onClick={() => navigate("/contact")}
            >
              Contact
            </a>
            <a
              className="text-slate-600 font-medium hover:text-emerald-600 transition-colors duration-200 active:scale-95 transition-transform duration-150 cursor-pointer"
              onClick={() => navigate("/pharmacy")}
            >
              Pharmacy
            </a>
          </nav>
        </div>

        {/* Actions & Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-slate-600">
            <button className="hover:text-emerald-600 transition-colors duration-200 active:scale-95 transition-transform duration-150 p-1 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            <button className="hover:text-emerald-600 transition-colors duration-200 active:scale-95 transition-transform duration-150 p-1 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">help_outline</span>
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {user || doctor ? (
              <button
                onClick={handleLogout}
                className="text-slate-600 font-medium hover:text-red-600 transition-colors"
              >
                Logout
              </button>
            ) : (
              <>
                <a className="text-slate-600 font-medium hover:text-emerald-600 transition-colors cursor-pointer" onClick={() => navigate("/login")}>
                  Login
                </a>
                <button 
                  onClick={() => navigate("/registration")}
                  className="bg-emerald-700 text-white px-4 py-2 rounded-full font-medium text-sm hover:bg-emerald-800 transition-colors active:scale-95 transition-transform duration-150"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Hide menu on Login/Register pages for cleaner mobile UI */}
          {!['/login', '/registration'].includes(window.location.pathname) && (
            <button
              onClick={toggleMenu}
              className="md:hidden focus:outline-none z-50 text-emerald-700"
            >
              <div className="relative w-6 h-6 flex items-center justify-center">
                <GiHamburgerMenu size={24} />
              </div>
            </button>
          )}
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 z-40">
            <ul className="flex flex-col py-4 px-6 space-y-4 text-slate-700 font-medium">
              <li>
                <a className="block hover:text-emerald-600 transition-colors" href="/" onClick={handleLogout}>Home</a>
              </li>
              <li>
                <a className="block hover:text-emerald-600 transition-colors cursor-pointer" onClick={() => navigate("/about")}>About</a>
              </li>
              <li>
                <a className="block hover:text-emerald-600 transition-colors cursor-pointer" onClick={() => navigate("/contact")}>Contact</a>
              </li>
              <li>
                <a className="block hover:text-emerald-600 transition-colors cursor-pointer" onClick={() => navigate("/pharmacy")}>Pharmacy</a>
              </li>
              {!user && !doctor ? (
                <>
                  <li className="pt-2 border-t border-gray-100">
                    <a className="block hover:text-emerald-600 transition-colors cursor-pointer" onClick={() => navigate("/login")}>Login</a>
                  </li>
                  <li>
                    <a className="block hover:text-emerald-600 transition-colors cursor-pointer" onClick={() => navigate("/registration")}>Sign Up</a>
                  </li>
                </>
              ) : (
                <li className="pt-2 border-t border-gray-100">
                  <button onClick={handleLogout} className="text-red-600 hover:text-red-700 transition-colors w-full text-left">
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
