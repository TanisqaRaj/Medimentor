import { useEffect, useState } from "react";
import axios from "axios";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
import AOS from "aos";
import "aos/dist/aos.css";
//import doctor from "./assets/images/doctorsGrpPic1.webp";
//import doctors from "./assets/images/Doctors.png.png";
import CountUp from "react-countup";
import LazyImage from "./LazyImage";

const Landing = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const [totalDoctors, setTotalDoctors] = useState(null);
  const [totalUsers, setTotalusers] = useState(null);

  const fetchTotalUsers = async () => {
    try {
      const response = await axios.get(
        `${BACKEND}/doctors/totalusers`
      );
      const success = response?.data?.success;

      if (success) {
        const total = response.data.totalUsers;
        setTotalusers(total);
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.error("❌ Error fetching total doctors:", error);
    }
  };

  const fetchTotalDoctors = async () => {
    try {
      const response = await axios.get(
        `${BACKEND}/doctors/totaldoctors`
      );
      const success = response?.data?.success;

      if (success) {
        const total = response.data.totalDoctors;
        setTotalDoctors(total);
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      console.error("❌ Error fetching total doctors:", error);
    }
  };

  useEffect(() => {
    fetchTotalUsers();
    fetchTotalDoctors();
  }, []);
  return (
    <main className="w-full bg-background selection:bg-primary-container selection:text-on-primary-container m-0 p-0 overflow-hidden">
      <title>Doctor Appointment - Clinical Clarity</title>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-xl md:py-[80px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-xl items-center">
          <div className="md:col-span-5 flex flex-col items-start space-y-md">
            <div className="bg-surface-container px-sm py-xs rounded-full flex items-center gap-2 border border-outline-variant">
              <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
              <span className="font-label-md text-label-md text-on-surface-variant">
                Trusted by {totalUsers ? <><CountUp end={totalUsers} duration={4} />+</> : "..."} Patients &amp; {totalDoctors ? <><CountUp end={totalDoctors} duration={4} />+</> : "..."} Doctors
              </span>
            </div>
            <h1 className="font-display-lg text-headline-lg sm:text-display-md md:text-display-lg text-on-surface text-balance">
              Your Journey to <span className="text-primary">Clinical Excellence</span> Starts Here
            </h1>
            <p className="font-body-lg text-body-md sm:text-body-lg text-on-surface-variant max-w-[480px]">
              Access top-tier medical professionals, manage your prescriptions, and book consultations seamlessly through our secure, modern healthcare platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-sm pt-sm w-full sm:w-auto">
              <a href="/login" className="bg-primary text-on-primary px-lg py-sm rounded-full font-label-md text-label-md shadow-[0_4px_14px_0_rgba(0,93,66,0.39)] hover:bg-on-primary-fixed-variant transition-all hover:-translate-y-1 text-center">
                Book Appointment
              </a>
              <a href="/pharmacy-services" className="bg-transparent text-primary border-2 border-primary px-lg py-sm rounded-full font-label-md text-label-md hover:bg-primary/5 transition-all text-center">
                Explore Services
              </a>
            </div>
          </div>
          <div className="md:col-span-7 relative mt-10 md:mt-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-surface-container-low to-secondary-container/20 rounded-[2rem] transform translate-x-4 translate-y-4 -z-10"></div>
            <img alt="Modern Medical Clinic" className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover rounded-[2rem] border-4 border-surface-container-lowest shadow-2xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCI5Do1Pm2eJcPZL-GTT40jlo-1JJiqsgGSvyxeoAcu17qkWeFrInVSfPgjESLnHfYeS3XEikm37EGyeqC4nmmVWIJ5l47qLcDbt2dy2chL4BN20N-t_w2TH6Elh6AcekwjQgr02tMwihBw03YuW8VQWy01ifuCUHxrScQeTOEuolPT5Aj-CmIviyLTTq437v-UHHrS5YBz2aeDGwx_yn-_8OVPxHgP-GS1tyThYBhq9ELXYmX8UGxvvFg9WqDfrOyq16_aUpTQbKSa" />
          </div>
        </div>
      </section>

      {/* Service Highlights (Bento Grid) */}
      <section className="bg-surface-container-lowest py-xl border-y border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-xl">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Comprehensive Care Solutions</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">Integrated medical services designed for clarity, efficiency, and your peace of mind.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md auto-rows-[280px]">
            {/* Large Card: Online Consultation */}
            <div className="md:col-span-2 bg-surface-container-low rounded-xl p-md border border-outline-variant/50 hover:shadow-[0_10px_25px_-5px_rgba(4,120,87,0.05)] transition-all flex flex-col justify-between relative overflow-hidden group">
              <div className="relative z-10">
                <div className="bg-surface-container-lowest w-12 h-12 rounded-lg flex items-center justify-center mb-md shadow-sm">
                  <span className="material-symbols-outlined text-primary text-[28px] icon-fill">video_camera_front</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">Online Consultation</h3>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-md">Connect with specialists immediately from the comfort of your home. Secure, high-definition video calls for urgent and routine care.</p>
              </div>
              <div className="relative z-10 mt-auto">
                <a className="inline-flex items-center font-label-md text-label-md text-primary hover:text-on-primary-fixed-variant group-hover:translate-x-1 transition-transform" href="/login">
                  Book Virtual Visit <span className="material-symbols-outlined ml-1 text-[18px]">arrow_forward</span>
                </a>
              </div>
              <div className="absolute right-0 bottom-0 w-1/2 h-full bg-gradient-to-l from-secondary-container/20 to-transparent pointer-events-none"></div>
            </div>
            
            {/* Small Card 1: Pharmacy */}
            <div className="bg-surface-container rounded-xl p-md border border-outline-variant/50 hover:shadow-[0_10px_25px_-5px_rgba(4,120,87,0.05)] transition-all flex flex-col">
              <div className="bg-surface-container-lowest w-10 h-10 rounded-lg flex items-center justify-center mb-sm shadow-sm">
                <span className="material-symbols-outlined text-secondary text-[24px]">medication</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-xs text-[20px] leading-tight">Digital Pharmacy</h3>
              <p className="font-body-md text-body-md text-on-surface-variant text-[14px]">Manage prescriptions, request refills, and schedule home deliveries with clinical precision.</p>
              <a className="mt-auto inline-flex items-center font-label-md text-label-md text-secondary hover:text-on-secondary-container" href="/pharmacy">
                Order Meds <span className="material-symbols-outlined ml-1 text-[16px]">chevron_right</span>
              </a>
            </div>
            
            {/* Small Card 2: Health Tips */}
            <div className="bg-surface-container rounded-xl p-md border border-outline-variant/50 hover:shadow-[0_10px_25px_-5px_rgba(4,120,87,0.05)] transition-all flex flex-col">
              <div className="bg-surface-container-lowest w-10 h-10 rounded-lg flex items-center justify-center mb-sm shadow-sm">
                <span className="material-symbols-outlined text-secondary text-[24px]">health_metrics</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-xs text-[20px] leading-tight">Safety &amp; Usages</h3>
              <p className="font-body-md text-body-md text-on-surface-variant text-[14px]">Learn about the safe usage of medications and stay informed with the most recent health tips.</p>
              <a className="mt-auto inline-flex items-center font-label-md text-label-md text-secondary hover:text-on-secondary-container" href="/medication-usage">
                Learn More <span className="material-symbols-outlined ml-1 text-[16px]">chevron_right</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="max-w-7xl mx-auto px-6 py-xl">
        <div className="flex justify-between items-end mb-xl">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Featured Specialists</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Top-rated professionals dedicated to your well-being.</p>
          </div>
          <a href="/login" className="hidden md:flex bg-transparent text-primary font-label-md text-label-md items-center hover:underline underline-offset-4 cursor-pointer">
            View All Doctors <span className="material-symbols-outlined ml-1 text-[20px]">arrow_forward</span>
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          {/* Doctor 1 */}
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/60 shadow-sm hover:shadow-[0_10px_25px_-5px_rgba(4,120,87,0.1)] transition-shadow">
            <img alt="Dr. Robert Chen" className="w-full h-[240px] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKWgv_g_O9qqL58VRqcHj278uHCMCd5XbXUJh-adRHUNtL2gfWkFLb5TqjcUJ6s1bVYLiVZ3JjDVRhEa3rGmW4YhSZZIndYQwfx7skRRz9bb_tk0sCWOz0xZemGa68WPxRayOOXNdWaFcpnmSGQt9lrcW0tBE8fek9evgR-ExVXf9qLpjQkoSuyA-LMZs9_EokqKkYorvda-k7eFg6SRMvHrpU4sXRCIbawVHLCtPgF20LTKat5HWnRdJrUUxsTTWfcLCB1MbLvHnq" />
            <div className="p-md">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface text-[20px] leading-tight">Dr. Robert Chen</h3>
                  <p className="font-body-md text-body-md text-primary text-[14px] font-medium">Cardiology</p>
                </div>
                <div className="flex items-center bg-surface-container px-2 py-1 rounded">
                  <span className="material-symbols-outlined text-[#F59E0B] text-[16px] icon-fill">star</span>
                  <span className="font-label-md text-label-md text-on-surface ml-1 text-[12px]">4.9</span>
                </div>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant text-[14px] mb-md line-clamp-2">Specializing in preventative cardiology and advanced lipid management with 15+ years of clinical experience.</p>
              <a href="/login" className="block text-center w-full bg-surface-container-high text-on-surface px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-surface-container-highest transition-colors">
                Book Appointment
              </a>
            </div>
          </div>
          
          {/* Doctor 2 */}
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/60 shadow-sm hover:shadow-[0_10px_25px_-5px_rgba(4,120,87,0.1)] transition-shadow">
            <img alt="Dr. Sarah Jenkins" className="w-full h-[240px] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCf0aCKXOx2eiTYv8WxVYd7fghgc-x7-x0gnMWyApsuhGr6Bg9sHeqEl4NHIZg5wsQNQrd29Dsf56ohMUfLuLOceuHgg6teQMZAIEUQVqXqQCVnc26dp973PGT67c3YpftT6z8jzfpAKbvT8KLd_Aw_GVyVI59zce8Cmb8ppB18wmfSeTstnHStHC37E22cGOS3THGYkMhXaoZhsJanfRDrqxPg62y62HCEl_Iy02fVy_vsMajVNN_HyVe8-N90KQbeeVImm2HONS5J" />
            <div className="p-md">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface text-[20px] leading-tight">Dr. Sarah Jenkins</h3>
                  <p className="font-body-md text-body-md text-primary text-[14px] font-medium">Pediatrics</p>
                </div>
                <div className="flex items-center bg-surface-container px-2 py-1 rounded">
                  <span className="material-symbols-outlined text-[#F59E0B] text-[16px] icon-fill">star</span>
                  <span className="font-label-md text-label-md text-on-surface ml-1 text-[12px]">5.0</span>
                </div>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant text-[14px] mb-md line-clamp-2">Dedicated to comprehensive child healthcare from infancy through adolescence with a gentle approach.</p>
              <a href="/login" className="block text-center w-full bg-surface-container-high text-on-surface px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-surface-container-highest transition-colors">
                Book Appointment
              </a>
            </div>
          </div>
          
          {/* Doctor 3 */}
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/60 shadow-sm hover:shadow-[0_10px_25px_-5px_rgba(4,120,87,0.1)] transition-shadow hidden md:block">
            <img alt="Dr. Michael Torres" className="w-full h-[240px] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCe5GIrgH_1hQNKlElKdKsHGyqXSnQFpPjpuG7MOPvnNhIy9xroLxbBXTCtyek2-bRuhWGLYIsZzQHRRtLzjHHVa_MU7E5YTFJ-W3-2MD05EiZoQAqKx06I70n79KTkEP2O-KfYxPxU10s1hwNGIOlZd0rKYxEbVynRXkwm7k5Cl7-d2joynxFIj-SmXDqsVaFLz76sWkFgdu7C3Eu5bXnU1zIwZyGfUe-bC9Myu_Is8ZyHNI4QNUZiXo4MHGZKLS4NCj4YryC0HLe2" />
            <div className="p-md">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface text-[20px] leading-tight">Dr. Michael Torres</h3>
                  <p className="font-body-md text-body-md text-primary text-[14px] font-medium">Internal Medicine</p>
                </div>
                <div className="flex items-center bg-surface-container px-2 py-1 rounded">
                  <span className="material-symbols-outlined text-[#F59E0B] text-[16px] icon-fill">star</span>
                  <span className="font-label-md text-label-md text-on-surface ml-1 text-[12px]">4.8</span>
                </div>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant text-[14px] mb-md line-clamp-2">Expert in complex adult diseases, chronic condition management, and comprehensive health screenings.</p>
              <a href="/login" className="block text-center w-full bg-surface-container-high text-on-surface px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-surface-container-highest transition-colors">
                Book Appointment
              </a>
            </div>
          </div>
        </div>
        <a href="/login" className="md:hidden w-full mt-lg bg-transparent text-primary border-2 border-primary px-lg py-sm rounded-full font-label-md text-label-md block text-center">
          View All Doctors
        </a>
      </section>

      {/* Landing Video Section */}
      <section className="bg-surface-container-lowest py-xl px-6 border-t border-outline-variant/30">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
            Doctor Pharmacy Reservation
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-lg">
            Reserve your spot with our expert doctors. Get the best healthcare services at your convenience.
          </p>
          <a className="bg-primary text-on-primary px-lg py-sm rounded-full font-label-md text-label-md shadow-[0_4px_14px_0_rgba(0,93,66,0.39)] hover:bg-on-primary-fixed-variant transition-all hover:-translate-y-1 inline-block" href="/login">
            Reserve Now
          </a>

          {/* YouTube Video */}
          <div className="mt-xl w-full max-w-5xl mx-auto">
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-2xl shadow-lg border-4 border-surface-container-highest"
                src="https://www.youtube.com/embed/74DWwSxsVSs?autoplay=0&mute=0&controls=1&rel=0"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Landing;
