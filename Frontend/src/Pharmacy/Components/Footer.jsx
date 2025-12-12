
import React from 'react'
import { FaInstagram } from "react-icons/fa6";
import { PiFacebookLogoBold } from "react-icons/pi";
import { RiYoutubeLine } from "react-icons/ri";
import { FaWhatsapp } from "react-icons/fa6";
import { IoCallOutline } from "react-icons/io5";
import { MdMailOutline } from "react-icons/md";
import { FaRegCopyright } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/terms");
  };
  const handleNavigatePrivacyPolicy = () => {
    navigate("/privacyPolicy");
  };
  const helpCenter = () => {
    navigate("/helpcenter");
  };
  const handleNAvigateAppointment = () => {
    navigate("/appointment");
  };
  const handleNavigatePharmacy = () => {
    navigate("/pharmacy");
  };
  const handleNavigateUserDashboard = () => {
    navigate("/userdashboard");
  };

  return (
    <footer className="w-full shadow-md bg-emerald-400 flex">
      <div className="container mx-auto flex flex-col px-4 py-5">
       
        <div className="flex flex-col lg:flex-row justify-between md:flex-row md:space-x-4 w-full py-8">
          
          <div className="flex-col space-y-3 w-full md:w-1/2 lg:w-1/4">
            <h2 className="text-2xl font-bold text-slate-800">HealthCare</h2>
            <p className="font-medium text-sm text-slate-800">
              Revolutionizing healthcare access through technology
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com" className="hover:cursor-pointer"><FaInstagram /></a>
              <a href="https://www.facebook.com"><PiFacebookLogoBold /></a>
              <a href="https://www.youtube.com"><RiYoutubeLine /></a>
              <a href="https://www.whatsapp.com"><FaWhatsapp /></a>
            </div>
          </div>
         
          <div className="flex-col space-y-2 w-full hidden md:flex md:w-1/2 lg:w-1/4">
            <h1 className="text-xl font-bold text-slate-800">Quick Links</h1>
            <div className="text-slate-800 font-medium hover:cursor-pointer" onClick={handleNavigateUserDashboard}> Find a doctor</div>
            <div className="text-slate-800 font-medium hover:cursor-pointer"onClick={handleNAvigateAppointment}>Book appointment</div>
            <div className="text-slate-800 font-medium hover:cursor-pointer" onClick={handleNavigatePharmacy}>Buy medicine</div>
          </div>

          <div className="hidden lg:flex flex-col space-y-2 w-full lg:w-1/4">
            <h1 className="text-xl font-bold text-slate-800">Support</h1>
            <div
              className="text-slate-800 font-medium hover:cursor-pointer"
              onClick={helpCenter}
            >
              Help Center
            </div>
            <div
              className="text-slate-800 font-medium hover:cursor-pointer"
              onClick={handleNavigatePrivacyPolicy}
            >
              Privacy Policy
            </div>
            <div
              className="text-slate-800 font-medium hover:cursor-pointer"
              onClick={handleNavigate}
            >
              Terms of Service
            </div>
          </div>

          
          <div className="flex-col space-y-2 w-full md:w-1/2 lg:w-1/4">
            <h1 className="text-xl font-bold text-slate-800">Contact</h1>
            <div className="flex items-center gap-x-3">
              <IoCallOutline />
              <div className="text-slate-800 font-medium">222525445</div>
            </div>
            <div className="flex items-center gap-x-3">
              <MdMailOutline />
              <div className="text-slate-800 font-medium">14242cfbdbbdg@453543</div>
            </div>
          </div>
        </div>

        
        <div className="flex flex-col lg:flex-row justify-between items-center py-8 border-y border-textColor text-sm lg:text-base">
          <div className="text-black-700 text-center lg:text-left">
            "Your well-being is our priority,
            Your trust is our promise.
            <br />
            Caring for you is not just our duty,
            It’s a commitment to life and its beauty."
          </div>
          <div className="hidden lg:flex items-center justify-between max-w-sm mt-4 lg:mt-0">
            <input
              type="email"
              placeholder="Enter your Email.."
              className="rounded-l-full outline-none pl-2 h-8 text-xs lg:text-sm"
            />
            <button className="px-5 border rounded-r-full text-xs lg:text-sm h-8 bg-emerald-500 text-white hover:text-emerald-600 transition-all duration-200">
              Subscribe
            </button>
          </div>
        </div>

        <div className="flex gap-x-1 items-center justify-center mt-4 text-xs lg:text-sm">
          <FaRegCopyright />
          <div>2024 Healthcare. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

