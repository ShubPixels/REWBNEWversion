import React from "react";
import rewblogo from "../images/logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="container mx-auto px-6 flex flex-wrap justify-between">
        <div className="w-full lg:w-1/3 mb-6 lg:mb-0">
        <img src={rewblogo} alt="Logo" className="w-10 h-10 md:w-14 md:h-14" />
              <h1 className="text-lg md:text-2xl font-bold text-white">
                RANGANI
                <span className="text-cyan-500">  ENGINEERING</span>
              </h1>
          <p className="text-gray-400">
            Rangani Engineering PVT. LTD, the emerging manufacturing and trading firm.
          </p>
        </div>
        <div className="w-full lg:w-1/3 mb-6 lg:mb-0">
          <h4 className="text-xl font-bold mb-4">Company</h4>
          <ul className="text-gray-400">
            <li>
              <Link to="/" className="hover:text-teal-500 hover:underline">Home</Link>
            </li>
            <li>
              
              <Link to="/category-page" className="hover:text-teal-500 hover:underline">Products</Link>
            </li>
            <li>
              
              <Link to="/about" className="hover:text-teal-500 hover:underline">About Us</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-teal-500 hover:underline">Contact</Link>
            </li>
          </ul>
        </div>
        <div className="w-full lg:w-1/3">
          <h4 className="text-xl font-bold mb-4">Contact</h4>
          <ul className="text-gray-400">
            <li>Mobile: +91-9825075813 - Kanjibhai Rangani</li>
            <li>Mobile: +91-8000920222 - Milan Rangani</li>
            <li>Email: mail@ranganiindia.com</li>
            <li>Address: Survey No. 258, Plot No. 5 To 11, NH-8B, Gondal Road, Near Priyesh Cotton, Shapar, Rajkot-360024, Gujarat, India</li>
          </ul>
        </div>
      </div>
      <div className="text-center text-gray-500 mt-6">
        <p>&copy; 2025, Rangani Engineering. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
