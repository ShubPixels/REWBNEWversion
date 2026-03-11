// src/components/ImageCarousel.jsx
import React, { useState, useEffect } from 'react';

const ImageCarousel = () => {
  const images = [
    { id: 1, src: "/api/placeholder/800/500", alt: "Industrial machinery", title: "Precision Engineering" },
    { id: 2, src: "/api/placeholder/800/500", alt: "Modern architecture", title: "Architectural Design" },
    { id: 3, src: "/api/placeholder/800/500", alt: "Technology workspace", title: "Tech Solutions" },
    { id: 4, src: "/api/placeholder/800/500", alt: "Manufacturing equipment", title: "Advanced Manufacturing" },
    { id: 5, src: "/api/placeholder/800/500", alt: "Design studio", title: "Creative Workspace" }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  // Auto slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000);
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

      <div className="relative h-96">
        {/* Main carousel container with stacked image effect */}
        <div className="relative h-full overflow-hidden">
          {images.map((image, index) => {
            // Calculate position and z-index for stacked effect
            let zIndex = 10 - Math.abs(currentIndex - index);
            let opacity = index === currentIndex ? 1 : 0.5;
            let scale = index === currentIndex ? 1 : 0.85;
            let translateX = '0%';
            
            if (index < currentIndex) {
              translateX = '-15%';
            } else if (index > currentIndex) {
              translateX = '15%';
            }
            
            return (
              <div
                key={image.id}
                className="absolute top-0 w-full h-full transition-all duration-500 rounded-lg overflow-hidden shadow-lg"
                style={{
                  transform: `translateX(${translateX}) scale(${scale})`,
                  zIndex,
                  opacity,
                  display: Math.abs(currentIndex - index) > 2 ? 'none' : 'block'
                }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            );
          })}
        </div>

        {/* Navigation buttons */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full z-20"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full z-20"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Dots navigation */}
      <div className="flex justify-center mt-6 space-x-2">
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

export default ImageCarousel;