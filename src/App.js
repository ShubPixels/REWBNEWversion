// src/App.js
import React, { useState, useEffect } from "react";
import Footer from "./Components/Footer";
import ProductPage from "./pages/ProductPage";
import HomePage from "./pages/HomePage";
import NAVBAR from "./Components/Navbar";
import ScrollToTop from "./Components/ScrollToTop";
import { Routes, Route } from "react-router-dom";
import "swiper/css";
import "swiper/css/autoplay";
import Buttons from "./button";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import CategoryPage from "./pages/CategoriesPage";

// 👉 Popup images
import popupImage1 from "./images/promo1.jpg";
import popupImage2 from "./images/promo2.jpg";

const App = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([{ text: "How can I help you?", sender: "bot" }]);

  // --- POPUP STATE ---
  const [showPopup, setShowPopup] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  // Array of images
  const images = [popupImage1, popupImage2];

  // Show popup after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-slide images every 3 seconds
  useEffect(() => {
    if (!showPopup) return;
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [showPopup]);

  const closePopup = () => setShowPopup(false);

  // Handle ESC key & lock scroll
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") closePopup();
    };
    if (showPopup) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [showPopup]);

  const handleSendMessage = () => {
    if (userMessage.trim() !== "") {
      setMessages([...messages, { text: userMessage, sender: "user" }]);
      setUserMessage("");
    }
  };

  return (
    <>
      <NAVBAR />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category-page" element={<CategoryPage />} />
        <Route path="/products/:productName" element={<ProductPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
      </Routes>
      <Buttons />
      <Footer />

      {/* --- POPUP MODAL --- */}
      {showPopup && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Promotional popup"
          className="fixed inset-0 z-[9999] flex items-center justify-center"
        >
          {/* Background overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closePopup}
          />

          {/* Popup content */}
          <div className="relative mx-4 w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Close button */}
            <button
              onClick={closePopup}
              className="absolute right-2 top-2 rounded-full p-2 hover:bg-gray-100 focus:outline-none"
              aria-label="Close popup"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Carousel image */}
            <img
              src={images[currentImage]}
              alt="Promotional offer"
              className="w-full h-auto object-cover transition-opacity duration-500"
            />

            {/* Optional CTA section */}
            {/* <div className="p-4 text-center">
              <a
                href="/contact"
                className="inline-block rounded-full px-5 py-2 font-medium bg-teal-600 text-white hover:bg-teal-700"
              >
                Learn More
              </a>
            </div> */}
          </div>
        </div>
      )}
    </>
  );
};

export default App;
