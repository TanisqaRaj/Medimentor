import { useState, useEffect } from "react";
import { MdNavigateNext } from "react-icons/md";
import { MdNavigateBefore } from "react-icons/md";

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      image: "https://plus.unsplash.com/premium_photo-1668487826871-2f2cac23ad56?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bWVkaWNpbmV8ZW58MHx8MHx8fDA%3D",
      title: "Slide 1 Title",
      description: "This is the description for Slide 1."
    },
    {
      image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG1lZGljaW5lfGVufDB8fDB8fHww", 
      title: "Slide 2 Title",
      description: "This is the description for Slide 2."
    },
    {
      image: "https://media.istockphoto.com/id/2147705600/photo/doctor-holding-clipboard-consulting-child.webp?a=1&b=1&s=612x612&w=0&k=20&c=bbX5pyM2bI3OXRUYZNJw9fXN5Xa3bjl7HCN2jCtl08U=", 
      title: "Slide 3 Title",
      description: "This is the description for Slide 3."
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((currentIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((currentIndex - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="w-full bg-surface py-6 px-4 md:px-10">
      <div className="relative max-w-7xl mx-auto rounded-3xl overflow-hidden shadow-surface border border-outline-variant/30 group">
        
        {/* Main Content */}
        <div className="relative h-[250px] sm:h-[350px] md:h-[450px] w-full overflow-hidden">
          <img
            src={slides[currentIndex].image}
            alt={slides[currentIndex].title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          
          {/* Text Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-white max-w-2xl">
            <h2 className="font-display-lg text-headline-lg sm:text-display-md mb-2 drop-shadow-md leading-tight">
              {slides[currentIndex].title}
            </h2>
            <p className="font-body-lg text-body-md sm:text-body-lg opacity-90 mb-4 line-clamp-2 sm:line-clamp-none drop-shadow-sm">
              {slides[currentIndex].description}
            </p>
            <button className="bg-primary-container text-on-primary-container px-6 py-2 rounded-full font-label-md hover:bg-primary hover:text-on-primary transition-all">
              Learn More
            </button>
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100 hidden sm:flex"
          onClick={prevSlide}
        >
          <MdNavigateBefore size={24} />
        </button>

        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100 hidden sm:flex"
          onClick={nextSlide}
        >
          <MdNavigateNext size={24} />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 right-6 flex gap-2">
          {slides.map((_, idx) => (
            <div 
              key={idx}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-primary-container' : 'bg-white/40'}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
