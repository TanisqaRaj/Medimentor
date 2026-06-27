import React from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';
import { FaArrowLeft } from 'react-icons/fa';

const About = () => {
  React.useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleBack = () => {
    window.history.back();
  };

  return (
    <section className="bg-gray-100 py-12 px-6" id="about">
      <div className="relative">
        <button
          onClick={handleBack}
          className="absolute top-6 left-6 flex items-center px-4 py-2 bg-emerald-500 rounded hover:bg-emerald-600 focus:outline-none"
        >
          <FaArrowLeft className="mr-2" />
        </button>
      </div>
      <div className="container mx-auto text-center max-w-4xl" data-aos="fade-up">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">About Us</h2>
        <p className="text-lg text-gray-600 leading-relaxed mb-6">
          Welcome to our platform! We aim to provide the best services to our users, ensuring a seamless and enjoyable experience. 
          Our mission is to empower individuals by offering innovative solutions tailored to their needs. Explore more to see how we can assist you.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="w-60 bg-white shadow-md rounded-lg p-6" data-aos="fade-right">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">Our Vision</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              To create a future where technology and innovation enhance daily life for everyone.
            </p>
          </div>
          <div className="w-60 bg-white shadow-md rounded-lg p-6" data-aos="fade-up">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">Our Mission</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Deliver user-centric services with excellence, focusing on quality and value.
            </p>
          </div>
          <div className="w-60 bg-white shadow-md rounded-lg p-6" data-aos="fade-left">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">Our Values</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Integrity, innovation, and inclusivity are at the core of what we do.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
