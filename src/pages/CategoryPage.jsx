import { useState } from "react";

const productsData = {
  page1: [
    { id: 1, name: "Product 1", image: "/images/product1.jpg" },
    { id: 2, name: "Product 2", image: "/images/product2.jpg" },
    { id: 3, name: "Product 3", image: "/images/product3.jpg" },
    { id: 4, name: "Product 4", image: "/images/product4.jpg" },
    { id: 5, name: "Product 5", image: "/images/product5.jpg" },
    { id: 6, name: "Product 6", image: "/images/product6.jpg" },
    { id: 7, name: "Product 7", image: "/images/product7.jpg" },
    { id: 8, name: "Product 8", image: "/images/product8.jpg" },
    { id: 9, name: "Product 9", image: "/images/product9.jpg" },
    { id: 10, name: "Product 10", image: "/images/product10.jpg" },
    { id: 11, name: "Product 11", image: "/images/product11.jpg" },
  ],
  page2: [
    { id: 12, name: "Product 12", image: "/images/product12.jpg" },
    { id: 13, name: "Product 13", image: "/images/product13.jpg" },
    { id: 14, name: "Product 14", image: "/images/product14.jpg" },
    { id: 15, name: "Product 15", image: "/images/product15.jpg" },
    { id: 16, name: "Product 16", image: "/images/product16.jpg" },
  ],
  page3: [
    { id: 17, name: "Product 17", image: "/images/product17.jpg" },
    { id: 18, name: "Product 18", image: "/images/product18.jpg" },
    { id: 19, name: "Product 19", image: "/images/product19.jpg" },
    { id: 20, name: "Product 20", image: "/images/product20.jpg" },
    { id: 21, name: "Product 21", image: "/images/product21.jpg" },
    { id: 22, name: "Product 22", image: "/images/product22.jpg" },
  ],
};

export default function ProductPages() {
  const [currentPage, setCurrentPage] = useState("page1");

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Our Products</h1>
      <div className="flex justify-center gap-4 mb-6">
        {Object.keys(productsData).map((page, index) => (
          <button
            key={index}
            className={`px-4 py-2 rounded-lg text-white font-semibold transition-all duration-300 ${
              currentPage === page ? "bg-cyan-500" : "bg-gray-400"
            }`}
            onClick={() => setCurrentPage(page)}
          >
            {`Page ${index + 1}`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productsData[currentPage].map((product) => (
          <div
            key={product.id}
            className="bg-white shadow-md rounded-lg overflow-hidden p-4 transition-transform transform hover:scale-105"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-md"
            />
            <h3 className="text-lg font-semibold text-center mt-4">{product.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
