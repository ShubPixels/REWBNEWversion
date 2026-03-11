// File: TabComponent.jsx

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";


export default function TabComponent(props) {
  const [activeTab, setActiveTab] = useState("description");

  const [prevTab, setPrevTab] = useState("description");
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  const handleTabClick = (tabId) => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    const newIndex = tabs.findIndex(tab => tab.id === tabId);
    setDirection(newIndex > currentIndex ? 1 : -1);
    setPrevTab(activeTab);
    setActiveTab(tabId);
};


  const tabs = [
    { id: "description", label: "Description" },
    { id: "specifications", label: "Specifications" },
    { id: "applications", label: "Applications" },
    // ...(props.videoUrl ? [{ id: "video", label: "🎥 Watch Video", isLink: true, href: props.videoUrl }] : []),
  ];

  // This function dynamically renders the specifications based on their data type
  const renderSpecifications = (specs) => {
    // Case 1: If specs is just a string, render it in a paragraph.
    if (typeof specs === 'string') {
      return <p className="text-gray-700">{specs}</p>;
    }

    // Case 2: If specs is an array...
    if (Array.isArray(specs) && specs.length > 0) {
      // ...and its first item is a string, render a bulleted list.
      if (typeof specs[0] === 'string') {
        return (
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {specs.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        );
      }

      // ...and its first item is an object, render a full table.
      if (typeof specs[0] === 'object' && specs[0] !== null) {
        const headers = Object.keys(specs[0]);
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {headers.map(header => (
                    <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {specs.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50">
                    {headers.map(header => (
                      <td key={`${rowIndex}-${header}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {row[header]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
    }

    // Fallback for empty or unrecognized formats
    return <p className="text-gray-700">No specifications available.</p>;
  };

  return (
    <div className="w-full max-w-3xl p-4 border mb-2 rounded-lg shadow-md bg-white">
      {/* Tab Headers */}
      <div className="flex border-b overflow-x-auto no-scrollbar whitespace-nowrap">
        {tabs.map((tab) =>
          tab.isLink ? (
            <a
              key={tab.id}
              href={tab.href}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-medium text-teal-600 hover:underline min-w-[100px] text-center"
            >
              {tab.label}
            </a>
          ) : (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`px-4 py-2 text-sm font-medium min-w-[100px] text-center ${
                activeTab === tab.id
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
            >
              {tab.label}
            </button>
          )
        )}

      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeTab}
          initial={{ x: direction === 1 ? 100 : -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction === 1 ? -100 : 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4"
        >
          {activeTab === "description" && (
            <div className="space-y-4 text-gray-700">
              <p>{props.description}</p>
              {props.videoUrl && (
                <a
                  href={props.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-teal-500 text-black px-4 py-2 rounded-md hover:bg-teal-600 transition"
                >
                  🎥 Watch Video
                </a>
              )}
            </div>
          )}

          {activeTab === "specifications" && renderSpecifications(props.specifications)}
          {activeTab === "applications" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Material Suitable:</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {props.applications?.materials?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              {props.applications?.industries && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Industries Served:</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {props.applications.industries.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
        </motion.div>
      </AnimatePresence>


      {/* Disclaimer only for Specifications tab */}
      {activeTab === "specifications" && (
        <div className="px-4 pb-4">
          <p className="text-xs text-gray-500 italic">*Numbers may vary*</p>
        </div>
      )}

    </div>
  );
}