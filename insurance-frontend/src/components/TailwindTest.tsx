// src/components/TailwindTest.jsx
import React from "react";

const TailwindTest = () => {
  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4 mt-8">
      <div>
        <div className="text-xl font-medium text-black">Tailwind CSS CDN Test</div>
        <p className="text-gray-500">If you can see this styled properly, Tailwind CSS CDN is working!</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="h-16 bg-blue-500 rounded flex items-center justify-center text-white">Blue</div>
          <div className="h-16 bg-red-500 rounded flex items-center justify-center text-white">Red</div>
          <div className="h-16 bg-green-500 rounded flex items-center justify-center text-white">Green</div>
          <div className="h-16 bg-yellow-500 rounded flex items-center justify-center text-white">Yellow</div>
        </div>
      </div>
    </div>
  );
};

export default TailwindTest;