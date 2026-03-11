import React from "react";

export default function DisplayComponent(props) {
  return (
    <div className="w-full max-w-3xl p-4 mb-2 border rounded-lg shadow-md bg-white">
      {/* Tab Headers */}
      {/* <div className="flex border-b">
        <h2><p className="font-bold">{props.name}</p></h2>
      </div> */}

      {/* Tab Content */}
      <div className="p-4">
        <div>
          <p className="text-gray-700">
            {props.tagline}
          </p>
          <h3 className="mt-4 font-semibold">Benifits</h3>
          <ul className="list-disc list-inside text-gray-700">
            {/*
              - We map over the props.benefits array.
              - For each 'benefit' in the array, we return a <li> element.
              - The 'key' prop is important for React to efficiently update the list.
            */}
            {props.benifits && props.benifits.map((benifit, index) => (
              <li key={index}>{benifit}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}