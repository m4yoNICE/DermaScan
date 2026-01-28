import React from "react";

const Header = () => {
  return (
    <div className="bg-[#EFF6F8] px-8 py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          Welcome back, Glaisa Mae!
        </h1>
        
        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
          <span className="text-lg">👤</span>
        </div>
      </div>
    </div>
  );
};

export default Header;