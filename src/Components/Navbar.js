import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import "swiper/css";
import "swiper/css/autoplay";

// Import images
import rewblogo from "../images/logo.png";
import sociallogo from "../images/sociallogo.png";
import call from "../images/Vector.png";
import email from "../images/Vector 2.png";
import face from "../images/face.png";
import ins from "../images/insta.png";
import twi from "../images/twi.png";
import lindk from "../images/in.png";
import YT from "../images/youtube.png";
import threeAscarpbaling from "../images/3 Action Scrap Baling Press.png";
import twoAscrapbaling from "../images/2 action.png";
import petbottlingpress from "../images/PHOTO EDIT 22.png";
import Contpaperbaler from "../images/Manual Paper Baler Machine.jpg";
import Contbaler from "../images/Automatic  Continuous Baling Machine.jpg";
import Conscraper from "../images/bluemach.webp";
import shredder from "../images/Shredder Machine.jpg";
import jumboscrapbaling from "../images/Jumbo Scrap Baling Machine.jpg";
import bidbreaking from "../images/Bid Breaking Machine.jpg";
import carbalingmachine from "../images/Car Baling Machine.jpg";
import scrapshreaing from "../images/Scrap Shearing Machine (kechi).jpg";
import ringrolling from "../images/PHOTO EDIT 21.png";
import coldshearing from "../images/Cold Shearing Machine.jpg";
import heavylathe from "../images/Heavy Duty Lathe Machine.jpg";
import numberpunch from "../images/Number Punching Machine.jpg";
import sheetslit from "../images/Sheet Slitting Machine.jpg";
import dipipe from "../images/DI - Pipe Breaking Machine.jpg";
import pipehydro from "../images/Pipe Hydrotest Machine.jpg";
import gauginsizing from "../images/Pipe Sizing and Guaging Machine.jpg";
import hydraulic_cus from "../images/Hydraulic Press (customized).jpg";
import sheetbending from "../images/Sheet Bending Machine.jpg";
import manualpaperbaler from "../images/Manual Paper Baler Machine.jpg";

const NAVBAR = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [socialOpen, setSocialOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);



  useEffect(() => {
  let lastScrollY = window.scrollY;

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    // iOS can emit negative scroll values
    const adjustedScrollY = Math.max(currentScrollY, 0);

    setIsNavVisible(adjustedScrollY <= lastScrollY || adjustedScrollY < 10);
    lastScrollY = adjustedScrollY;
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  

  const categories = [
    {
      title: "Waste Management",
      image: [threeAscarpbaling, twoAscrapbaling, petbottlingpress, Contbaler, Conscraper, shredder, jumboscrapbaling, carbalingmachine, bidbreaking, scrapshreaing],
      products: [
        "Triple Action Scrap Baling Press",
        "Double Action Scrap Baling Press",
        "PET Bottle Baling Press",
        // "Continuous Paper Baling Machine",
        "Continuous Baling Machine",
        "Continuous Scrapping Machine",
        "Shredder Machine",
        "Jumbo Scrap Baling Press",
        "Car Baler Machine",
        "Bid Breaking Machine",
        "Scrap Shearing Machine (Kechi)"
      ]
    },
    {
      title: "Industrial Machines",
      image: [ringrolling, coldshearing, heavylathe, numberpunch, sheetslit],
      products: [
        "Ring Rolling Machine",
        "Cold Shearing Machine",
        "Heavy Duty Lathe Machine",
        "Number Punching Machine",
        "Sheet Slitting Machine"
      ]
    },
    {
      title: "Special Purpose Machines",
      image: [dipipe, pipehydro, gauginsizing, hydraulic_cus, sheetbending, manualpaperbaler],
      products: [
        "DI Pipe Breaking Machine",
        "Pipe Hydrotest Machine",
        "Big Pipe Gauging and Sizing Machine",
        "Hydraulic Press (Customized)",
        "Sheet Plate Bending Machine",
        "Manual Paper Baling Machine"
      ]
    }
  ];
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  // Centralized social media links with icons and URLs
  const socialMediaLinks = [
    { icon: YT, alt: "YouTube", url: "https://www.youtube.com/@RanganiEngineeringPvtLtd" },
    { icon: ins, alt: "Instagram", url: "https://www.instagram.com/rangani_engineering_pvt_ltd" },
    { icon: face, alt: "Facebook", url: "https://www.facebook.com/people/Rangani-Engineering-Pvt-Ltd/100063895899990/" },
    // { icon: twi, alt: "Twitter", url: "https://www.twitter.com/" }, // Added Twitter as an example
    // { icon: lindk, alt: "LinkedIn", url: "https://www.linkedin.com/" } // Added LinkedIn as an example
  ];

  return (
    <div className="font-sans">
      {/* Header */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${isNavVisible ? "translate-y-0" : "-translate-y-full"} bg-white shadow-md`}>
        <div className="bg-white py-2 relative">
        <div className="container mx-auto flex flex-wrap justify-between text-sm px-4 md:px-8 text-gray-700">
          {/* Contact Info - Desktop and medium+ screens */}
          <div className="hidden min-[380px]:flex items-center gap-4">
            <span className="flex items-center gap-2">
              <img src={call} alt="call" className="w-4 h-4" /> +91 8000920222
            </span>
            <span className="flex items-center gap-2">
              <img src={email} alt="email" className="w-4 h-4" /> mail@ranganiindia.com
            </span>
          </div>

          {/* Contact Info Toggle - Small screens only */}
          <div className="flex min-[380px]:hidden items-center">
            <button onClick={() => setContactOpen(!contactOpen)} className="mr-2">
              <img src={call} alt="Toggle Contact Info" className="w-6 h-6" />
            </button>
          </div>


          {/* Desktop Social Icons - now with dynamic links */}
          <div className="hidden sm:flex gap-4 items-center">
            {socialMediaLinks.map((social, idx) => (
              <a href={social.url} key={idx} className="hover:text-teal-500" target="_blank" rel="noopener noreferrer">
                <img src={social.icon} alt={social.alt} className="w-10 h-10" />
              </a>
            ))}
          </div>

          {/* Mobile Social Toggle Button - changed icon */}
          <button
            onClick={() => setSocialOpen(!socialOpen)}
            className="sm:hidden flex items-center"
          >
            <img
              src={sociallogo} // <-- Add the correct path to your logo
              alt="Toggle Social Links"    // <-- Add descriptive alt text
              className="w-8 h-8 rounded-full object-cover" // object-cover is useful if the logo isn't perfectly square
            />
          </button>
        </div>

        {/* Sliding Mobile Menu - now with dynamic links */}
        {socialOpen && (
          <div className="absolute right-4 top-full mt-2 bg-white shadow-lg rounded-lg p-3 flex flex-col gap-3 sm:hidden transition-all duration-300 z-10">
            {socialMediaLinks.map((social, idx) => (
              <a href={social.url} key={idx} className="hover:text-teal-500" target="_blank" rel="noopener noreferrer">
                <img src={social.icon} alt={social.alt} className="w-5 h-5" />
              </a>
            ))}
          </div>
        )}
        {contactOpen && (
          <div className="absolute left-4 top-full mt-2 bg-white shadow-lg rounded-lg p-3 flex flex-col gap-2 sm:hidden transition-all duration-300 z-10 text-sm">
            <div className="flex items-center gap-2">
              <img src={call} alt="call" className="w-4 h-4" /> +91 8000920222
            </div>
            <div className="flex items-center gap-2">
              <img src={email} alt="email" className="w-4 h-4" /> mail@ranganiindia.com
            </div>
          </div>
        )}

      </div>

        {/* Navigation */}
        <nav className="bg-white shadow-md">
          <div className="container mx-auto flex items-center justify-between px-4 md:px-8 py-3">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link to="/"><img src={rewblogo} alt="Logo" className="w-10 h-10 md:w-14 md:h-14" /></Link>
              <Link to="/">
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                  <span className="text-teal-500">RANGANI</span> <br />
                  ENGINEERING PVT LTD
                </h1>
              </Link>  
            </div>

            {/* Hamburger Menu */}
            <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-800 focus:outline-none">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            {/* Desktop Navigation */}
            {/* Adjusted layout for navigation after removing search */}
            <ul className="hidden md:flex gap-6 text-gray-800 font-medium"> {/* Removed w-auto and flex-grow from parent to rely on gap-6 */}
              <li><Link to="/" className="hover:text-teal-500">Home</Link></li>
              <li
                className="relative group"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <Link to="/category-page" className="hover:text-teal-500 flex items-center cursor-pointer">Our Products ▾</Link>
                {isDropdownOpen && (
                  <div className="absolute top-full right-0 bg-white shadow-lg border border-gray-200 rounded-lg w-[700px] flex z-50">
                    <div className="w-1/3 bg-gray-100 p-4 rounded-l-lg">
                      <ul>
                        {categories.map((category, index) => (
                          <li
                            key={index}
                            onMouseEnter={() => setSelectedCategory(category)}
                            className={`p-3 cursor-pointer rounded-md transition ${selectedCategory?.title === category.title ? "bg-teal-500 text-white" : "hover:bg-orange-100"}`}
                          >
                            {category.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="w-2/3 bg-white p-4 rounded-r-lg">
                      <h3 className="text-teal-500 font-semibold mb-3">{selectedCategory?.title || categories[0]?.title}</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {selectedCategory?.products.map((product, idx) => (
                          <Link
                            key={idx}
                            to={`/products/${product.toLowerCase().replace(/\s+/g, "-")}`}
                            className="flex flex-col items-center text-center text-gray-700 hover:text-teal-500 transition"
                          >
                            <img src={selectedCategory.image[idx]} alt={product} className="w-16 h-16 object-contain" />
                            <span className="text-sm">{product}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </li>
              <li><Link to="/about" className="hover:text-teal-500">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-teal-500">Contact</Link></li>
              <li>
                  <a href="/Rangani Brochure.pdf" download className="hover:text-teal-500">
                      Get Brochure 
                  </a>
              </li>

            </ul>

            {/* Search Box - COMMENTED OUT */}
            {/*
            <div className={`transition-all duration-300 border-2 border-teal-500 rounded-full flex items-center overflow-hidden ${isHovered ? "w-64" : "w-12 h-10"}`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
              {isHovered ? (
                <input type="text" placeholder="Search..." className="w-full px-4 py-2 outline-none text-gray-800" />
              ) : (
                <button className="flex items-center justify-center w-12 h-full bg-teal-500 text-white text-sm">🔍</button>
              )}
            </div>
            */}
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden w-full bg-white shadow-lg rounded-lg px-4 pb-4 space-y-4 overflow-y-auto max-h-[80vh]">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-800 hover:text-teal-500">Home</Link>

              <div className="flex justify-between items-center">
                <Link
                  to="/category-page"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsDropdownOpen(false);
                  }}
                  className="text-gray-800 hover:text-teal-500"
                >
                  Our Products
                </Link>
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="text-gray-800">
                  ▾
                </button>
              </div>

              {isDropdownOpen && (
                <div className="pl-2 max-h-[300px] overflow-y-auto pr-2 space-y-2">
                  {categories.map((category, index) => (
                    <div key={index}>
                      <h4 className="text-teal-600 font-semibold">{category.title}</h4>
                      <ul className="pl-2">
                        {category.products.map((product, idx) => (
                          <li key={idx}>
                            <Link
                              to={`/products/${product.toLowerCase().replace(/\s+/g, "-")}`}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="text-sm text-gray-600 hover:text-teal-500"
                            >
                              {product}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-800 hover:text-teal-500">About Us</Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block text-gray-800 hover:text-teal-500">Contact</Link>

            </div>
          )}
        </nav>
      </header>
    </div>
  );
};

export default NAVBAR;