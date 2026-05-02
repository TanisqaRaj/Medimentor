
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
    <footer className="w-full py-12 border-t bg-slate-50 border-slate-200 font-manrope text-sm text-slate-500 mt-xl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          <div className="flex flex-col space-y-4">
            <h2 className="text-2xl font-extrabold tracking-tighter text-emerald-700">MediMentor</h2>
            <p className="font-medium text-slate-600 max-w-xs">
              Revolutionizing healthcare access through technology. Clinical Excellence &amp; Professional Care.
            </p>
            <div className="flex space-x-4 mt-2">
              <a href="https://www.instagram.com" className="text-slate-400 hover:text-emerald-600 transition-colors text-xl"><FaInstagram /></a>
              <a href="https://www.facebook.com" className="text-slate-400 hover:text-emerald-600 transition-colors text-xl"><PiFacebookLogoBold /></a>
              <a href="https://www.youtube.com" className="text-slate-400 hover:text-emerald-600 transition-colors text-xl"><RiYoutubeLine /></a>
              <a href="https://www.whatsapp.com" className="text-slate-400 hover:text-emerald-600 transition-colors text-xl"><FaWhatsapp /></a>
            </div>
          </div>
         
          <div className="flex flex-col space-y-3">
            <h1 className="text-lg font-bold text-slate-900">Quick Links</h1>
            <button className="text-left text-slate-600 hover:text-emerald-600 transition-colors font-medium" onClick={handleNavigateUserDashboard}>Find a doctor</button>
            <button className="text-left text-slate-600 hover:text-emerald-600 transition-colors font-medium" onClick={handleNAvigateAppointment}>Book appointment</button>
            <button className="text-left text-slate-600 hover:text-emerald-600 transition-colors font-medium" onClick={handleNavigatePharmacy}>Buy medicine</button>
          </div>

          <div className="flex flex-col space-y-3">
            <h1 className="text-lg font-bold text-slate-900">Support</h1>
            <button className="text-left text-slate-600 hover:text-emerald-600 transition-colors font-medium" onClick={helpCenter}>
              Help Center
            </button>
            <button className="text-left text-slate-600 hover:text-emerald-600 transition-colors font-medium" onClick={handleNavigatePrivacyPolicy}>
              Privacy Policy
            </button>
            <button className="text-left text-slate-600 hover:text-emerald-600 transition-colors font-medium" onClick={handleNavigate}>
              Terms of Service
            </button>
          </div>

          <div className="flex flex-col space-y-3">
            <h1 className="text-lg font-bold text-slate-900">Contact</h1>
            <div className="flex items-center gap-x-3 text-slate-600">
              <IoCallOutline className="text-emerald-600 text-lg" />
              <span className="font-medium">222525445</span>
            </div>
            <div className="flex items-center gap-x-3 text-slate-600">
              <MdMailOutline className="text-emerald-600 text-lg" />
              <span className="font-medium">contact@medimentor.com</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-center py-8 border-y border-slate-200">
          <div className="text-slate-600 text-center lg:text-left font-medium italic max-w-md">
            "Your well-being is our priority, Your trust is our promise. Caring for you is not just our duty, It’s a commitment to life and its beauty."
          </div>
          <div className="flex items-center mt-6 lg:mt-0 bg-white border border-slate-200 rounded-full overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
            <input
              type="email"
              placeholder="Enter your email..."
              className="px-4 py-2 outline-none text-sm w-48 sm:w-64 border-none focus:ring-0 text-slate-700 bg-transparent"
            />
            <button className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors">
              Subscribe
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-8 text-xs text-slate-500">
          <div className="flex items-center gap-x-1">
            <FaRegCopyright />
            <span>2024 MediMentor. All rights reserved.</span>
          </div>
          <div className="hidden sm:flex gap-4">
            <button onClick={handleNavigatePrivacyPolicy} className="hover:text-emerald-600 hover:underline underline-offset-4 transition-colors">Privacy</button>
            <button onClick={handleNavigate} className="hover:text-emerald-600 hover:underline underline-offset-4 transition-colors">Terms</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

