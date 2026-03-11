// File: src/pages/CategoriesPage.jsx (Option 1 – Magazine Showcase)

import React, { useMemo, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import FadeInSection from "./Fadeinsection";

// Category key images
import threeAscarpbaling from "../images/3 Action Scrap Baling Press.png";
import ringrolling from "../images/PHOTO EDIT 21.png";
import DI_Pipe_Breaking_Machine from "../images/DIPIPE.webp";
import manufaclog from "../images/manufaclogo_CTP.png";

// Product data map (slug -> meta)
import productsData from "./ProductData";

const CATEGORY_LIST = [
  {
    id: 0,
    name: "Waste Management",
    image: threeAscarpbaling,
    description:
      "High-pressure balers, shredders and cutting systems to compact, process and monetise scrap while lowering disposal costs.",
    productSlugs: [
      "triple-action-scrap-baling-press",
      "double-action-scrap-baling-press",
      "pet-bottle-baling-press",
      "continuous-baling-machine",
      "continuous-scrapping-machine",
      "shredder-machine",
      "jumbo-scrap-baling-press",
      "car-baler-machine",
      "bid-breaking-machine",
      "scrap-shearing-machine-(kechi)",
    ],
  },
  {
    id: 1,
    name: "Industrial Machines",
    image: ringrolling,
    description:
      "Heavy-duty presses and production equipment engineered for uptime, precision and low maintenance.",
    productSlugs: [
      "ring-rolling-machine",
      "cold-shearing-machine",
      "heavy-duty-lathe-machine",
      "number-punching-machine",
      "sheet-slitting-machine",
    ],
  },
  {
    id: 2,
    name: "Special Purpose Machines",
    image: DI_Pipe_Breaking_Machine,
    description:
      "When off‑the‑shelf falls short, we build to your process – hydraulics + automation, delivered with documentation and training.",
    productSlugs: [
      "di-pipe-breaking-machine",
      "pipe-hydrotest-machine",
      "big-pipe-gauging-and-sizing-machine",
      "hydraulic-press-(customized)",
      "sheet-plate-bending-machine",
      "manual-paper-baling-machine",
    ],
  },
  {
    id: 3,
    name: "Manufacturing Services",
    image: manufaclog,
    description:
      "End‑to‑end build: forging, casting, CNC, fabrication, assembly, QA and global delivery to spec.",
    productSlugs: [],
  },
];

function useCategoryFromQuery() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const q = params.get("category");
  return useMemo(() => {
    if (!q) return null;
    const match = CATEGORY_LIST.find((c) => c.name.toLowerCase() === q.toLowerCase());
    return match?.id ?? null;
  }, [q]);
}

const CategoriesPage = () => {
  const initialId = useCategoryFromQuery();
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    if (typeof initialId === "number") setOpenId(initialId);
  }, [initialId]);

  const openCategory = (id) => setOpenId(id);
  const closeModal = () => setOpenId(null);

  const activeCategory =
    typeof openId === "number" ? CATEGORY_LIST.find((c) => c.id === openId) : null;

  return (
    <div className="bg-cyan-50 min-h-screen pt-28 pb-16">
      {/* HERO */}
      <FadeInSection>
        <section className="container mx-auto px-4 md:px-8 mb-10">
          <div className="rounded-2xl bg-white shadow-md border border-gray-100 overflow-hidden">
            <div className="p-8 md:p-10 lg:p-12 flex flex-col md:flex-row items-center gap-6">
              <div className="md:w-2/3 text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
                  Engineering Excellence, Clearly Organised
                </h1>
                <p className="text-gray-600 mt-3 text-lg">
                  Explore our categories with large, easy‑to‑scan showcases. Click any category to view
                  its top machines in a visual gallery.
                </p>
              </div>
              <div className="md:w-1/3 w-full">
                <div className="w-full aspect-[3/2] bg-gradient-to-tr from-teal-500/10 to-cyan-500/10 rounded-xl border border-teal-100 flex items-center justify-center">
                  <span className="text-teal-600 font-semibold">Rangani Engineering</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* CATEGORY SHOWCASE GRID */}
      <FadeInSection>
        <section className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {CATEGORY_LIST.map((cat) => (
              <article
                key={cat.id}
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row items-stretch">
                  {/* Image side */}
                  <div className="md:w-1/2 w-full bg-white p-6 flex items-center justify-center">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="max-h-64 w-auto object-contain"
                      loading="lazy"
                    />
                  </div>

                  {/* Content side */}
                  <div className="md:w-1/2 w-full p-6 md:p-8 flex flex-col">
                    <div className="mb-3">
                      <span className="inline-block text-xs tracking-wide uppercase text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                        {cat.productSlugs.length > 0
                          ? `${cat.productSlugs.length} products`
                          : "Service"}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                      {cat.name}
                    </h2>
                    <p className="text-gray-600 mt-3 text-base md:text-lg leading-relaxed">
                      {cat.description}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      {cat.productSlugs.length > 0 ? (
                        <button
                          onClick={() => openCategory(cat.id)}
                          className="px-5 py-3 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-200"
                        >
                          View Products
                        </button>
                      ) : (
                        <Link
                          to="/contact"
                          className="px-5 py-3 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-200"
                        >
                          Discuss Your Project
                        </Link>
                      )}

                      <Link
                        to={`/category-page?category=${encodeURIComponent(cat.name)}`}
                        className="px-5 py-3 rounded-lg border-2 border-teal-600 text-teal-700 font-semibold hover:bg-teal-50"
                      >
                        Learn More
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </FadeInSection>

      {/* MODAL – Visual product gallery */}
      {activeCategory && (
        <CategoryModal category={activeCategory} onClose={closeModal} />
      )}
    </div>
  );
};

function CategoryModal({ category, onClose }) {
  // build product list from slugs
  const products = useMemo(() => {
    return (category.productSlugs || [])
      .map((slug) => productsData?.[slug])
      .filter(Boolean)
      .map((p, i) => ({
        id: i + 1,
        name: p.name,
        image: Array.isArray(p.image) ? p.image[0] : p.image,
        slug: p.name.toLowerCase().replace(/\s+/g, "-"),
      }));
  }, [category.productSlugs]);

  // close on escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* overlay */}
      <button
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
        aria-label="Close"
      />

      {/* dialog */}
      <div className="relative w-full sm:w-11/12 lg:w-4/5 xl:w-3/4 max-h-[90vh] overflow-hidden rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl border border-gray-100">
        {/* header */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-100 p-5 md:p-6 flex items-start md:items-center gap-4">
          <div className="shrink-0 hidden sm:block">
            <img
              src={category.image}
              alt={category.name}
              className="h-12 w-auto object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 truncate">
              {category.name}
            </h3>
            <p className="text-gray-600 text-sm md:text-base mt-1 line-clamp-2">
              {category.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto inline-flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 w-10 h-10"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-600">
              <path fillRule="evenodd" d="M6.225 4.811a.75.75 0 011.06 0L12 9.525l4.715-4.714a.75.75 0 111.06 1.06L13.06 10.586l4.715 4.714a.75.75 0 11-1.06 1.061L12 11.646l-4.715 4.715a.75.75 0 11-1.06-1.061l4.714-4.714-4.714-4.715a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* body */}
        <div className="p-5 md:p-6 overflow-y-auto max-h-[calc(90vh-72px)]">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((prod) => (
                <Link
                  key={prod.id}
                  to={`/products/${prod.slug}`}
                  className="group block bg-white rounded-xl border border-gray-200 hover:border-emerald-300 shadow-sm hover:shadow-md transition overflow-hidden"
                  onClick={onClose}
                >
                  <div className="h-48 flex items-center justify-center p-4 bg-white">
                    {prod.image ? (
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="max-h-full max-w-full object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <div className="text-gray-400">No image</div>
                    )}
                  </div>
                  <div className="px-4 py-3">
                    <h4 className="font-semibold text-gray-800 group-hover:text-emerald-700 line-clamp-2">
                      {prod.name}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-700 text-lg font-medium mb-3">
                This section covers our end‑to‑end manufacturing services.
              </p>
              <p className="text-gray-500 max-w-2xl mx-auto mb-6">
                Share your drawing or spec, and we’ll build to standard with full QA, documentation
                and global delivery.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700"
                onClick={onClose}
              >
                Contact Us
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoriesPage;
