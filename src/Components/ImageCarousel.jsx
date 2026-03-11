// src/components/ImageCarousel.jsx
import React, { useState, useEffect } from 'react';
import Continuous_Scrapping_Machine from "../images/bluemach.webp";
import Hydrotest_machine from "../images/PHOTO EDIT 25.webp";
import Cold_Shearing_Machine from "../images/PHOTO_EDIT_1_resized.png";
import Continuous_Baling_Machine from "../images/PHOTO_EDIT_6_resized.png";
import DI_Pipe_Breaking_Machine from "../images/DIPIPE.webp";

const ImageCarousel = () => {
  const images = [
    { id: 1, src: Continuous_Scrapping_Machine, alt: "Industrial machinery", title: "Continuous Scrapping Machine" },
    { id: 2, src: Hydrotest_machine, alt: "Modern architecture", title: "Hydrotest machine" },
    { id: 3, src: Cold_Shearing_Machine, alt: "Technology workspace", title: "Cold Shearing Machine" },
    { id: 4, src: Continuous_Baling_Machine, alt: "Manufacturing equipment", title: "Continuous Baling Machine" },
    { id: 5, src: DI_Pipe_Breaking_Machine, alt: "Design studio", title: "DI - Pipe Breaking Machine" }
  ];

  // Preload all carousel images for smooth rendering
  useEffect(() => {
    images.forEach(({ src }) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);

  const goToSlide = (index) => setCurrentIndex(index);
  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };
  const goToNext = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Our Latest <span className="text-teal-500">Work</span>
        </h1>
        <p className="text-gray-600">✦ Made With Excellence</p>
      </div>

      <div className="relative h-128" style={{ height: "32rem" }}>
        <div className="relative h-full overflow-hidden">
          {images.map((image, index) => {
            const zIndex = 10 - Math.abs(currentIndex - index);
            const opacity = index === currentIndex ? 1 : 0.5;
            const scale = index === currentIndex ? 1 : 0.85;
            let translateX = '0%';
            if (index < currentIndex) translateX = '-15%';
            if (index > currentIndex) translateX = '15%';

            return (
              <div
                key={image.id}
                className="absolute top-0 w-full h-full transition-all duration-500 rounded-lg overflow-hidden shadow-lg"
                style={{
                  transform: `translateX(${translateX}) scale(${scale})`,
                  zIndex,
                  opacity,
                  display: Math.abs(currentIndex - index) > 2 ? 'none' : 'block',
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading={index === 0 ? "eager" : "lazy"}
                  className="w-full h-full object-contain"
                />
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full z-20 backdrop-blur-md"
          aria-label="Previous slide"
        >
          {/* SVG left arrow */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full z-20 backdrop-blur-md"
          aria-label="Next slide"
        >
          {/* SVG right arrow */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Title Dot & Label */}
      <div className="flex justify-center mt-4">
        <div
          className="px-6 py-2 rounded-full transition-all duration-300"
          style={{
            backgroundColor: "rgba(229, 231, 235, 0.5)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(229, 231, 235, 0.7)",
          }}
        >
          <h3 className="text-gray-800 text-lg font-semibold">{images[currentIndex].title}</h3>
        </div>
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center mt-4 space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-indigo-600 w-4' : 'bg-gray-300'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(ImageCarousel);
