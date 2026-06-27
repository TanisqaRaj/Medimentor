import { useEffect, useRef, useState } from "react";

const LazyImage = ({ src, alt, className = "", ...props }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const imageRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imageRef.current) observer.observe(imageRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imageRef} className="relative w-fit h-fit">
      {!loaded && (
        <div className="absolute inset-0 bg-gray-300 animate-pulse rounded-lg" />
      )}
      {isVisible && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          loading="lazy"
          className={`transition-opacity duration-500 rounded-lg ${
            loaded ? "opacity-100" : "opacity-0"
          } ${className}`}
          {...props}
        />
      )}
    </div>
  );
};

export default LazyImage;
