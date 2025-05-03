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
import axios from "axios";

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const doctor = useSelector((state) => state.auth.doctor);
  const token = useSelector((state) => state.auth.token);
  const handleLogout = () => {
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
        .post("http://localhost:8080/auth/verify-token", tokenObj)
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
    <header className="bg-white shadow-md w-full sticky top-0 z-[999] ">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo Section */}
        <div className="flex items-center hidden md:block">
          <img alt="Logo" className="h-10" height={150} src="https://res.cloudinary.com/dzfftyy42/image/upload/f_auto,q_auto/v1/initial%20Img/kidunrkrjfvaiubzr5lv" width={50} />
        </div>

        {/* Hamburger button */}
        <button
          onClick={toggleMenu}
          className="md:hidden focus:outline-none z-50"
        >
          <div className="relative w-6 h-6">
            <GiHamburgerMenu />
          </div>
        </button>

        {/* Navigation Bar */}
        <nav className="flex-grow flex justify-center space-x-6">
          {/* home */}
          <a
            className="text-gray-700 hover:text-teal-600 hidden md:block"
            href="/"
            onClick={handleLogout}
          >
            Home
          </a>
          {/* About */}
          <a
            className="text-gray-700 hover:text-teal-600 hover:cursor-pointer hidden md:block"
            onClick={() => navigate("/about")}
          >
            About
          </a>
          {/* Services */}
          <div className="relative hidden md:block">
            <div
              className="flex items-center cursor-pointer text-gray-700 hover:text-teal-600"
              onClick={toggleDropdown}
            >
              <a>Services</a>
              <RiArrowDropDownLine className="ml-1" />
            </div>

            {isOpen && (
              <div className="absolute mt-2 bg-white border rounded shadow-lg w-48 z-[100]">
                <ul className="py-2">
                  <li className="px-4 py-2 hover:bg-teal-100">
                    <a href="/appointment">Appointment</a>
                  </li>
                  <li className="px-4 py-2 hover:bg-teal-100">
                    <a href="/pharmacy">Pharmacy</a>
                  </li>
                  <li className="px-4 py-2 hover:bg-teal-100">
                    <a href="/chatbot">Chatbot</a>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Contact */}
          <a
            className="text-gray-700 hover:text-teal-600 hover:cursor-pointer hidden md:block"
            onClick={() => navigate("/contact")}
          >
            Contact
          </a>
          <a
            className="text-gray-700 hover:text-teal-600 hover:cursor-pointer hidden md:block"
            onClick={() => navigate("/pharmacy")}
          >
            Pharmacy
          </a>
        </nav>
        {/* Login/Register Section */}
        <div className="flex items-center space-x-4">
          {user || doctor ? (
            <button
              onClick={handleLogout}
              className="text-gray-700 hover:text-red-600"
            >
              Logout
            </button>
          ) : (
            <>
              <a className="text-gray-700 hover:text-teal-600" href="/login">
                Login
              </a>
              <a
                className="text-gray-700 hover:text-teal-600 hidden md:block"
                href="/registration"
              >
                SignUp
              </a>
            </>
          )}
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-1/2 sm:w-1/4 bg-emerald-500 shadow-2xl px-2 py-4 z-40 rounded-md">
            <ul className="flex flex-col space-y-2 text-white">
              <li>
                <a href="/" onClick={handleLogout}>
                  Home
                </a>
              </li>
              <li>
                <button onClick={() => navigate("/about")}>About</button>
              </li>
              <li>
                <button onClick={() => navigate("/contact")}>Contact</button>
              </li>
              <li>
                <button onClick={() => navigate("/pharmacy")}>Pharmacy</button>
              </li>
              {!user && !doctor && (
                <>
                  <li>
                    <a href="/login">Login</a>
                  </li>
                  <li>
                    <a href="/registration">SignUp</a>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
