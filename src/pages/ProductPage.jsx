// File: ProductPage.jsx

import React from "react";
import { useParams, Link } from "react-router-dom";
import productsData from "./ProductData";
import TabComponent from "../Components/TabComponent";
import DisplayComponent from "../Components/DisplayComponent";
import FadeInSection from "./Fadeinsection";

// --- STEP 1: Import the category images ---
import wastemanageimg from "../images/bluemach.webp";
import industrialimg from "../images/Cold Shearing Machine.jpg";
import specialpurpimg from "../images/Pipe Sizing and Guaging Machine.jpg";


const ProductPage = () => {
  const { productName } = useParams();
  const product = productsData[productName];

  const currentProductCategory = product ? product.category : "";
  const relatedProducts = product
    ? Object.keys(productsData)
        .filter(
          (key) =>
            productsData[key].category === currentProductCategory &&
            key !== productName
        )
        .map((key) => ({
          key,
          ...productsData[key],
        }))
        .sort(() => 0.5 - Math.random())
        .slice(0, 4)
    : [];

  const allMainCategories = [
    "Waste Management",
    "Industrial Machines",
    "Special Purpose Machines",
  ];

  const otherCategoriesToShow = allMainCategories.filter(
    (cat) => cat !== currentProductCategory
  );

  // --- STEP 2: Create a map to link category names to the imported images ---
  const categoryImageMap = {
    "Waste Management": wastemanageimg,
    "Industrial Machines": industrialimg,
    "Special Purpose Machines": specialpurpimg,
  };


  if (!product) {
    return (
      <div className="container mx-auto p-6 pt-32 text-center">
        <h1 className="text-3xl font-bold">Product not found</h1>
        <Link
          to="/"
          className="text-teal-500 hover:underline mt-4 inline-block"
        >
          Go back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white pt-28">
      <FadeInSection>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          {product.name}
        </h1>

        <section className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="w-full lg:w-1/2 h-80 md:h-[500px]">
            <img
              src={product.image[0]}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>

          <div className="w-full lg:w-1/2">
            <DisplayComponent
              className="pb-4"
              name={product.name}
              tagline={product.tagline}
              benifits={product.benifits}
            />
            <TabComponent
              description={product.description}
              specifications={product.specifications}
              applications={product.applications}
              videoUrl={product.videoUrl}
            />
          </div>
        </section>
      </div>
      </FadeInSection>

      <FadeInSection>
      <section className="bg-cyan-50 py-16 px-4 md:px-12">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              More from the category
            </h2>
            <Link
              to="/category-page"
              state={{ category: currentProductCategory }}
              className="text-teal-500 font-semibold hover:underline"
            >
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct.key}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col p-4"
              >
                <div className="h-40 bg-white flex justify-center items-center rounded-md mb-4">
                  <img
                    src={relatedProduct.image[0]}
                    alt={relatedProduct.name}
                    className="h-full max-w-full object-contain"
                  />
                </div>

                <h3 className="text-lg font-semibold">{relatedProduct.name}</h3>
                <p className="text-sm text-gray-500 flex-grow mb-4">
                  {relatedProduct.tagline}
                </p>

                <div className="mt-auto">
                  <Link
                    to={`/products/${relatedProduct.key}`}
                    className="group relative inline-flex items-center justify-center"
                  >
                    <div
                      className="
                        absolute -inset-1 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500
                        blur-md opacity-30
                        transition-all duration-300 group-hover:opacity-45 group-hover:blur-lg
                      "
                    ></div>

                    <span
                      className="
                        relative w-full px-5 py-2 rounded-full
                        text-sm font-semibold text-gray-800
                        bg-white/80 border border-white/60 backdrop-blur-sm
                        transition-colors duration-300 group-hover:bg-white
                      "
                    >
                      📖 Learn more
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-12 mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Other <span className="text-teal-500">Categories</span>
            </h2>
            <Link
              to="/category-page"
              className="text-teal-500 font-semibold hover:underline"
            >
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherCategoriesToShow.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col p-4"
              >
                {/* --- STEP 3: Replace the grey div with a dynamic image --- */}
                <div className="h-40 bg-white rounded-md flex items-center justify-center p-4">
                  <img
                    src={categoryImageMap[category]}
                    alt={category}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <h3 className="text-lg font-semibold mt-4 flex-grow">{category}</h3>

                <div className="mt-4">
                  <Link
                    to="/category-page"
                    state={{ category: category }}
                    className="group relative inline-flex items-center justify-center"
                  >
                    <div
                      className="
                        absolute -inset-1 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500
                        blur-md opacity-30
                        transition-all duration-300 group-hover:opacity-45 group-hover:blur-lg
                      "
                    ></div>
                    <span
                      className="
                        relative w-full px-5 py-2 rounded-full
                        text-sm font-semibold text-gray-800
                        bg-white/80 border border-white/60 backdrop-blur-sm
                        transition-colors duration-300 group-hover:bg-white
                      "
                    >
                      📖 Learn more
                    </span>
                  </Link>
                </div>
              </div>
            ))}

            <div
              className="
                rounded-lg shadow-md p-6 flex flex-col justify-between 
                transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl
                bg-gradient-to-br from-teal-500 to-cyan-600 text-white
              "
            >
              
              <p className="text-xl font-bold">
                Got something on your mind? <br />
                Let's work <span className="font-extrabold text-cyan-200">Together!</span>
              </p>
              <Link to="/contact">
              <button className="mt-6 bg-white text-teal-600 font-bold py-2 w-full rounded-md transition-transform duration-300 hover:scale-105">
                CONTACT US
              </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      </FadeInSection>
    </div>
  );
};

export default ProductPage;